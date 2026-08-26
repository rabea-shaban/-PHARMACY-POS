import { prisma } from '../../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
export class PurchasesRepository {
    defaultInclude = {
        supplier: {
            select: {
                id: true,
                name: true,
                phone: true,
            },
        },
        createdBy: {
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
                        sellingPrice: true,
                    },
                },
                batch: {
                    select: {
                        id: true,
                        batchNumber: true,
                        expiryDate: true,
                        quantity: true,
                    },
                },
            },
        },
    };
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { supplierId, invoiceNumber, status, startDate, endDate, sortBy = 'purchaseDate', sortOrder = 'desc' } = filters;
        const where = {};
        if (supplierId) {
            where.supplierId = supplierId;
        }
        if (invoiceNumber) {
            where.invoiceNumber = { contains: invoiceNumber };
        }
        if (status) {
            where.status = status;
        }
        if (startDate || endDate) {
            where.purchaseDate = {};
            if (startDate)
                where.purchaseDate.gte = new Date(startDate);
            if (endDate)
                where.purchaseDate.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            prisma.purchase.findMany({
                where,
                include: this.defaultInclude,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.purchase.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return prisma.purchase.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
    }
    async findByInvoiceNumber(invoiceNumber) {
        return prisma.purchase.findUnique({
            where: { invoiceNumber },
            include: this.defaultInclude,
        });
    }
    async create(data) {
        return prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    supplierId: data.supplierId,
                    invoiceNumber: data.invoiceNumber,
                    purchaseDate: data.purchaseDate || new Date(),
                    subtotal: data.subtotal,
                    discount: data.discount,
                    tax: data.tax,
                    total: data.total,
                    paidAmount: data.paidAmount,
                    remainingAmount: data.remainingAmount,
                    status: data.status,
                    createdById: data.createdById,
                    notes: data.notes || null,
                },
            });
            // Create purchase items
            for (const item of data.items) {
                await tx.purchaseItem.create({
                    data: {
                        purchaseId: purchase.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitCost: item.unitCost,
                        discount: item.discount,
                        tax: item.tax,
                        total: item.total,
                    },
                });
            }
            return tx.purchase.findUnique({
                where: { id: purchase.id },
                include: this.defaultInclude,
            });
        });
    }
    async update(id, data) {
        return prisma.purchase.update({
            where: { id },
            data,
            include: this.defaultInclude,
        });
    }
    async receiveAtomic(purchaseId, overrides, actorId) {
        return prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.findUnique({
                where: { id: purchaseId },
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            });
            if (!purchase) {
                throw new NotFoundError(`Purchase with ID '${purchaseId}' not found`);
            }
            if (purchase.status !== 'PENDING') {
                throw new BadRequestError(`Cannot receive purchase with status '${purchase.status}'. Only PENDING purchases can be received.`);
            }
            // Process each item
            for (const item of purchase.items) {
                const itemOverride = overrides?.find((o) => o.itemId === item.id || o.productId === item.productId);
                const batchNumber = itemOverride?.batchNumber || `BAT-${purchase.invoiceNumber}-${item.productId.slice(0, 4)}`.toUpperCase();
                let expiryDate;
                if (itemOverride?.expiryDate) {
                    expiryDate = new Date(itemOverride.expiryDate);
                }
                else {
                    // Default expiry 1 year from now if not explicitly passed
                    const d = new Date();
                    d.setFullYear(d.getFullYear() + 1);
                    expiryDate = d;
                }
                const sellingPrice = itemOverride?.sellingPrice !== undefined
                    ? itemOverride.sellingPrice
                    : Number(item.product.sellingPrice);
                // Check if batch exists for this product & batchNumber
                let batch = await tx.batch.findUnique({
                    where: {
                        productId_batchNumber: {
                            productId: item.productId,
                            batchNumber,
                        },
                    },
                });
                if (batch) {
                    // Update existing batch quantity and purchasePrice
                    batch = await tx.batch.update({
                        where: { id: batch.id },
                        data: {
                            quantity: batch.quantity + item.quantity,
                            purchasePrice: item.unitCost,
                            sellingPrice,
                            expiryDate,
                        },
                    });
                }
                else {
                    // Create new batch
                    batch = await tx.batch.create({
                        data: {
                            productId: item.productId,
                            batchNumber,
                            expiryDate,
                            quantity: item.quantity,
                            purchasePrice: item.unitCost,
                            sellingPrice,
                        },
                    });
                }
                // Link item to batch
                await tx.purchaseItem.update({
                    where: { id: item.id },
                    data: { batchId: batch.id },
                });
                // Record immutable inventory transaction
                await tx.inventoryTransaction.create({
                    data: {
                        productId: item.productId,
                        batchId: batch.id,
                        quantity: item.quantity,
                        type: 'PURCHASE',
                        referenceType: 'PURCHASE',
                        referenceId: purchase.invoiceNumber,
                        reason: `Goods receipt from supplier invoice ${purchase.invoiceNumber}`,
                        createdById: actorId || null,
                    },
                });
            }
            // Update purchase status to RECEIVED
            const updatedPurchase = await tx.purchase.update({
                where: { id: purchaseId },
                data: { status: 'RECEIVED' },
                include: this.defaultInclude,
            });
            return updatedPurchase;
        });
    }
    async cancelAtomic(purchaseId, reason) {
        return prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.findUnique({
                where: { id: purchaseId },
            });
            if (!purchase) {
                throw new NotFoundError(`Purchase with ID '${purchaseId}' not found`);
            }
            if (purchase.status === 'CANCELLED') {
                throw new BadRequestError('Purchase is already CANCELLED');
            }
            if (purchase.status === 'RECEIVED') {
                throw new BadRequestError('Cannot cancel a RECEIVED purchase directly. Received purchases have already increased inventory. Use inventory adjustment or return workflows.');
            }
            const updatedNotes = reason
                ? `${purchase.notes ? purchase.notes + ' | ' : ''}[CANCELLED: ${reason}]`
                : purchase.notes;
            return tx.purchase.update({
                where: { id: purchaseId },
                data: {
                    status: 'CANCELLED',
                    notes: updatedNotes,
                },
                include: this.defaultInclude,
            });
        });
    }
}
export const purchasesRepository = new PurchasesRepository();
//# sourceMappingURL=purchases.repository.js.map