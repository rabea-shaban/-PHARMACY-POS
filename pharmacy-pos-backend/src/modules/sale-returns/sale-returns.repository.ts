import { Prisma, SaleStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { SaleReturnQueryFilters } from './sale-returns.types.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export interface AtomicReturnPlan {
  saleId: string;
  customerId?: string | null;
  processedById: string;
  reason?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  items: {
    saleItemId: string;
    productId: string;
    batchId: string | null;
    quantity: number;
    refundAmount: number;
  }[];
  commissionReversal?: {
    userId: string;
    ruleId?: string | null;
    rate: number;
    amount: number;
  } | null;
  loyaltyReversalPoints?: number;
}

export class SaleReturnsRepository {
  private readonly defaultInclude = {
    customer: {
      select: {
        id: true,
        name: true,
        phone: true,
      },
    },
    processedBy: {
      select: {
        id: true,
        name: true,
        role: true,
      },
    },
    sale: {
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
        status: true,
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
        saleItem: true,
      },
    },
  };

  async findMany(filters: SaleReturnQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { search, returnNumber, saleId, customerId, processedById, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const where: Prisma.SaleReturnWhereInput = {};

    if (search) {
      where.OR = [
        { returnNumber: { contains: search } },
        { sale: { invoiceNumber: { contains: search } } },
        { customer: { name: { contains: search } } },
      ];
    }

    if (returnNumber) where.returnNumber = { contains: returnNumber };
    if (saleId) where.saleId = saleId;
    if (customerId) where.customerId = customerId;
    if (processedById) where.processedById = processedById;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      prisma.saleReturn.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.saleReturn.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.saleReturn.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findBySaleId(saleId: string) {
    return prisma.saleReturn.findMany({
      where: { saleId },
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSaleWithItems(saleId: string) {
    return prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        items: {
          include: {
            product: true,
            batch: true,
            returnItems: true,
          },
        },
        returns: {
          include: {
            items: true,
          },
        },
        commissionTransactions: true,
        customer: true,
      },
    });
  }

  async createSaleReturnAtomic(plan: AtomicReturnPlan) {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: plan.saleId },
        include: { items: true },
      });

      if (!sale) {
        throw new NotFoundError(`Sale with ID '${plan.saleId}' not found`);
      }

      // 1. Generate unique return number: RET-YYYYMMDD-XXXXXX
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const rand = Math.floor(1000 + Math.random() * 9000);
      const returnNumber = `RET-${dateStr}-${Date.now().toString().slice(-4)}${rand}`;

      // 2. Restore Inventory Batch quantities & Log Inventory Transactions
      for (const item of plan.items) {
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
              referenceType: 'SALE_RETURN',
              referenceId: returnNumber,
              reason: `Sale return refund for ${sale.invoiceNumber}: ${plan.reason || 'Customer Return'}`,
              createdById: plan.processedById,
            },
          });
        }
      }

      // 3. Create SaleReturn record
      const saleReturn = await tx.saleReturn.create({
        data: {
          returnNumber,
          saleId: plan.saleId,
          customerId: plan.customerId || null,
          processedById: plan.processedById,
          reason: plan.reason || null,
          subtotal: plan.subtotal,
          tax: plan.tax,
          total: plan.total,
        },
      });

      // 4. Create SaleReturnItem records
      for (const item of plan.items) {
        await tx.saleReturnItem.create({
          data: {
            saleReturnId: saleReturn.id,
            saleItemId: item.saleItemId,
            productId: item.productId,
            batchId: item.batchId,
            quantity: item.quantity,
            refundAmount: item.refundAmount,
          },
        });
      }

      // 5. Reverse Commission if applicable
      if (plan.commissionReversal && plan.commissionReversal.amount > 0) {
        await tx.commissionTransaction.create({
          data: {
            userId: plan.commissionReversal.userId,
            saleId: plan.saleId,
            commissionRuleId: plan.commissionReversal.ruleId || null,
            salesAmount: -plan.total,
            commissionAmount: -plan.commissionReversal.amount,
            commissionRate: plan.commissionReversal.rate,
          },
        });
      }

      // 6. Reverse Loyalty Points if applicable
      if (plan.customerId && plan.loyaltyReversalPoints && plan.loyaltyReversalPoints > 0) {
        const loyaltyAccount = await tx.loyaltyAccount.findUnique({
          where: { customerId: plan.customerId },
        });

        if (loyaltyAccount) {
          const newBalance = Math.max(0, loyaltyAccount.totalPoints - plan.loyaltyReversalPoints);
          await tx.loyaltyAccount.update({
            where: { id: loyaltyAccount.id },
            data: { totalPoints: newBalance },
          });

          await tx.loyaltyTransaction.create({
            data: {
              loyaltyAccountId: loyaltyAccount.id,
              type: 'ADJUSTMENT',
              points: -plan.loyaltyReversalPoints,
              balanceAfter: newBalance,
              referenceType: 'SALE_RETURN',
              referenceId: returnNumber,
              reason: `Points deducted due to return ${returnNumber} on invoice ${sale.invoiceNumber}`,
            },
          });
        }
      }

      // 7. Update Sale status (Check if full or partial return)
      const allSaleItems = await tx.saleItem.findMany({
        where: { saleId: plan.saleId },
        include: { returnItems: true },
      });

      const totalSoldQty = allSaleItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalReturnedQty = allSaleItems.reduce((sum, i) => {
        const returnedForThisItem = i.returnItems.reduce((rSum, r) => rSum + r.quantity, 0);
        return sum + returnedForThisItem;
      }, 0);

      const newSaleStatus = totalReturnedQty >= totalSoldQty ? SaleStatus.RETURNED : SaleStatus.PARTIALLY_RETURNED;
      await tx.sale.update({
        where: { id: plan.saleId },
        data: { status: newSaleStatus },
      });

      // 8. Record Audit Log
      await tx.auditLog.create({
        data: {
          userId: plan.processedById,
          action: 'CREATE',
          entity: 'sale_returns',
          entityId: saleReturn.id,
          newData: JSON.stringify({
            returnNumber,
            invoiceNumber: sale.invoiceNumber,
            refundTotal: plan.total,
            itemsCount: plan.items.length,
          }),
        },
      });

      // 9. Return hydrated record
      return tx.saleReturn.findUnique({
        where: { id: saleReturn.id },
        include: this.defaultInclude,
      });
    });
  }
}

export const saleReturnsRepository = new SaleReturnsRepository();
