import { SaleStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
export class SalesRepository {
    defaultInclude = {
        customer: {
            select: {
                id: true,
                name: true,
                phone: true,
                tier: true,
            },
        },
        user: {
            select: {
                id: true,
                name: true,
                role: true,
            },
        },
        items: {
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        barcode: true,
                    },
                },
                batch: {
                    select: {
                        id: true,
                        batchNumber: true,
                        expiryDate: true,
                    },
                },
            },
        },
        payments: {
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
        insurance: {
            include: {
                insuranceProvider: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
        commissionTransactions: true,
    };
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { search, invoiceNumber, customerId, userId, status, paymentMethod, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const where = {};
        if (search) {
            where.OR = [
                { invoiceNumber: { contains: search } },
                { customer: { name: { contains: search } } },
                { customer: { phone: { contains: search } } },
            ];
        }
        if (invoiceNumber) {
            where.invoiceNumber = { contains: invoiceNumber };
        }
        if (customerId) {
            where.customerId = customerId;
        }
        if (userId) {
            where.userId = userId;
        }
        if (status) {
            where.status = status;
        }
        if (paymentMethod) {
            where.payments = {
                some: { paymentMethod },
            };
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            prisma.sale.findMany({
                where,
                include: this.defaultInclude,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.sale.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return prisma.sale.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
    }
    async findByInvoiceNumber(invoiceNumber) {
        return prisma.sale.findUnique({
            where: { invoiceNumber },
            include: this.defaultInclude,
        });
    }
    async createSaleAtomic(plan) {
        return prisma.$transaction(async (tx) => {
            // 1. Generate unique invoice number: INV-YYYYMMDD-XXXXXX
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
            const rand = Math.floor(1000 + Math.random() * 9000);
            const invoiceNumber = `INV-${dateStr}-${Date.now().toString().slice(-4)}${rand}`;
            // 2. Decrement Batch Stock with strict concurrency safety
            for (const item of plan.items) {
                if (item.batchId) {
                    const updateResult = await tx.batch.updateMany({
                        where: {
                            id: item.batchId,
                            quantity: { gte: item.quantity },
                        },
                        data: {
                            quantity: { decrement: item.quantity },
                        },
                    });
                    if (updateResult.count === 0) {
                        const batch = await tx.batch.findUnique({ where: { id: item.batchId } });
                        throw new BadRequestError(`Insufficient stock for batch '${batch?.batchNumber || item.batchId}'. Requested ${item.quantity}, Available: ${batch?.quantity || 0}`);
                    }
                    // Create inventory transaction record
                    await tx.inventoryTransaction.create({
                        data: {
                            productId: item.productId,
                            batchId: item.batchId,
                            quantity: -item.quantity,
                            type: 'SALE',
                            referenceType: 'SALE',
                            referenceId: invoiceNumber,
                            reason: `POS Sale invoice: ${invoiceNumber}`,
                            createdById: plan.cashierId,
                        },
                    });
                }
            }
            // 3. Create Sale record
            const sale = await tx.sale.create({
                data: {
                    invoiceNumber,
                    customerId: plan.customerId || null,
                    userId: plan.cashierId,
                    subtotal: plan.subtotal,
                    discount: plan.discount,
                    discountReason: plan.discountReason || null,
                    insuranceAmount: plan.insuranceAmount,
                    tax: plan.tax,
                    total: plan.total,
                    paidAmount: plan.paidAmount,
                    remainingAmount: plan.remainingAmount,
                    status: SaleStatus.COMPLETED,
                    notes: plan.notes || null,
                },
            });
            // 4. Create Sale Items
            for (const item of plan.items) {
                await tx.saleItem.create({
                    data: {
                        saleId: sale.id,
                        productId: item.productId,
                        batchId: item.batchId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        tax: item.tax,
                        total: item.total,
                    },
                });
            }
            // 5. Create Payments
            for (const p of plan.payments) {
                await tx.payment.create({
                    data: {
                        saleId: sale.id,
                        amount: p.amount,
                        paymentMethod: p.paymentMethod,
                        referenceNumber: p.referenceNumber || null,
                        notes: p.notes || null,
                        createdById: plan.cashierId,
                    },
                });
            }
            // 6. Create Sale Insurance if applied
            if (plan.insurance) {
                await tx.saleInsurance.create({
                    data: {
                        saleId: sale.id,
                        insuranceProviderId: plan.insurance.insuranceProviderId,
                        coveredAmount: plan.insurance.coveredAmount,
                        customerAmount: plan.insurance.customerAmount,
                        coveragePercentage: plan.insurance.coveragePercentage,
                        claimReference: plan.insurance.claimReference || null,
                    },
                });
            }
            // 7. Handle Loyalty if customer is registered
            if (plan.customerId) {
                let loyaltyAccount = await tx.loyaltyAccount.findUnique({
                    where: { customerId: plan.customerId },
                });
                if (!loyaltyAccount) {
                    loyaltyAccount = await tx.loyaltyAccount.create({
                        data: {
                            customerId: plan.customerId,
                            totalPoints: 0,
                        },
                    });
                }
                let currentPoints = loyaltyAccount.totalPoints;
                // 7a. Points Redemption
                if (plan.loyalty?.redeemPoints && plan.loyalty.redeemPoints > 0) {
                    if (currentPoints < plan.loyalty.redeemPoints) {
                        throw new BadRequestError(`Insufficient loyalty points. Requested: ${plan.loyalty.redeemPoints}, Available: ${currentPoints}`);
                    }
                    currentPoints -= plan.loyalty.redeemPoints;
                    await tx.loyaltyTransaction.create({
                        data: {
                            loyaltyAccountId: loyaltyAccount.id,
                            type: 'REDEEM',
                            points: -plan.loyalty.redeemPoints,
                            balanceAfter: currentPoints,
                            referenceType: 'SALE',
                            referenceId: invoiceNumber,
                            reason: `Redeemed points on invoice ${invoiceNumber}`,
                        },
                    });
                }
                // 7b. Points Earning
                if (plan.loyalty?.pointsEarned && plan.loyalty.pointsEarned > 0) {
                    currentPoints += plan.loyalty.pointsEarned;
                    await tx.loyaltyTransaction.create({
                        data: {
                            loyaltyAccountId: loyaltyAccount.id,
                            type: 'EARN',
                            points: plan.loyalty.pointsEarned,
                            balanceAfter: currentPoints,
                            referenceType: 'SALE',
                            referenceId: invoiceNumber,
                            reason: `Earned points for purchase on invoice ${invoiceNumber}`,
                        },
                    });
                }
                // Update loyalty account balance
                await tx.loyaltyAccount.update({
                    where: { id: loyaltyAccount.id },
                    data: { totalPoints: currentPoints },
                });
                // 7c. Check Tier Upgrade (Only upgrade, never demote higher assigned tier)
                if (plan.loyalty?.pointsEarned && plan.loyalty.pointsEarned > 0) {
                    const customer = await tx.customer.findUnique({
                        where: { id: plan.customerId },
                        include: { tier: true },
                    });
                    const activeTiers = await tx.customerTier.findMany({
                        where: { isActive: true },
                        orderBy: { minimumPoints: 'desc' },
                    });
                    const qualifiedTier = activeTiers.find((t) => currentPoints >= t.minimumPoints);
                    if (qualifiedTier &&
                        (!customer?.tier || qualifiedTier.minimumPoints > customer.tier.minimumPoints)) {
                        await tx.customer.update({
                            where: { id: plan.customerId },
                            data: { tierId: qualifiedTier.id },
                        });
                    }
                }
            }
            // 8. Handle Staff Commission
            if (plan.commission && plan.commission.amount > 0) {
                await tx.commissionTransaction.create({
                    data: {
                        userId: plan.cashierId,
                        saleId: sale.id,
                        commissionRuleId: plan.commission.ruleId || null,
                        salesAmount: plan.total,
                        commissionAmount: plan.commission.amount,
                        commissionRate: plan.commission.rate,
                    },
                });
            }
            // 9. Record Audit Log
            await tx.auditLog.create({
                data: {
                    userId: plan.cashierId,
                    action: 'CREATE',
                    entity: 'sales',
                    entityId: sale.id,
                    newData: JSON.stringify({
                        invoiceNumber,
                        total: plan.total,
                        itemsCount: plan.items.length,
                        paidAmount: plan.paidAmount,
                    }),
                },
            });
            // 10. Return full hydrated sale
            return tx.sale.findUnique({
                where: { id: sale.id },
                include: this.defaultInclude,
            });
        });
    }
    async cancelSaleAtomic(saleId, actorId, reason) {
        return prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({
                where: { id: saleId },
                include: {
                    items: true,
                    payments: true,
                    customer: true,
                },
            });
            if (!sale) {
                throw new NotFoundError(`Sale with ID '${saleId}' not found`);
            }
            if (sale.status === SaleStatus.CANCELLED) {
                throw new BadRequestError(`Sale '${sale.invoiceNumber}' is already cancelled`);
            }
            // 1. Revert Inventory quantities
            for (const item of sale.items) {
                if (item.batchId) {
                    await tx.batch.update({
                        where: { id: item.batchId },
                        data: {
                            quantity: { increment: item.quantity },
                        },
                    });
                    await tx.inventoryTransaction.create({
                        data: {
                            productId: item.productId,
                            batchId: item.batchId,
                            quantity: item.quantity,
                            type: 'MANUAL_IN',
                            referenceType: 'SALE_CANCEL',
                            referenceId: sale.invoiceNumber,
                            reason: `Sale cancellation refund for ${sale.invoiceNumber}: ${reason}`,
                            createdById: actorId,
                        },
                    });
                }
            }
            // 2. Mark sale as CANCELLED
            const updatedSale = await tx.sale.update({
                where: { id: saleId },
                data: {
                    status: SaleStatus.CANCELLED,
                    notes: sale.notes ? `${sale.notes} | CANCELLED: ${reason}` : `CANCELLED: ${reason}`,
                },
                include: this.defaultInclude,
            });
            // 3. Record Audit Log
            await tx.auditLog.create({
                data: {
                    userId: actorId,
                    action: 'DELETE',
                    entity: 'sales',
                    entityId: sale.id,
                    metadata: JSON.stringify({ reason, invoiceNumber: sale.invoiceNumber }),
                },
            });
            return updatedSale;
        });
    }
}
export const salesRepository = new SalesRepository();
//# sourceMappingURL=sales.repository.js.map