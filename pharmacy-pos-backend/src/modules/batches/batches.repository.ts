import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { BatchQueryFilters } from './batches.types.js';

export class BatchesRepository {
  private readonly defaultInclude = {
    product: {
      select: {
        id: true,
        name: true,
        barcode: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  async findMany(filters: BatchQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { productId, batchNumber, inStockOnly, sortBy = 'expiryDate', sortOrder = 'asc' } = filters;

    const where: Prisma.BatchWhereInput = {};

    if (productId) {
      where.productId = productId;
    }

    if (batchNumber) {
      where.batchNumber = { contains: batchNumber };
    }

    if (inStockOnly) {
      where.quantity = { gt: 0 };
    }

    const [items, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.batch.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.batch.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findByProductAndBatchNumber(productId: string, batchNumber: string) {
    return prisma.batch.findUnique({
      where: {
        productId_batchNumber: {
          productId,
          batchNumber,
        },
      },
      include: this.defaultInclude,
    });
  }

  async findByProductId(productId: string) {
    return prisma.batch.findMany({
      where: { productId },
      include: this.defaultInclude,
      orderBy: { expiryDate: 'asc' },
    });
  }

  async create(data: {
    productId: string;
    batchNumber: string;
    expiryDate: Date;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    actorId?: string | null;
  }) {
    return prisma.$transaction(async (tx) => {
      const batch = await tx.batch.create({
        data: {
          productId: data.productId,
          batchNumber: data.batchNumber,
          expiryDate: data.expiryDate,
          quantity: data.quantity,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
        },
      });

      // If initial stock quantity is provided > 0, record initial inventory transaction
      if (data.quantity > 0) {
        await tx.inventoryTransaction.create({
          data: {
            productId: data.productId,
            batchId: batch.id,
            quantity: data.quantity,
            type: 'MANUAL_IN',
            reason: `Initial stock for batch ${data.batchNumber}`,
            createdById: data.actorId || null,
          },
        });
      }

      const batchWithProduct = await tx.batch.findUnique({
        where: { id: batch.id },
        include: this.defaultInclude,
      });

      return batchWithProduct || batch;
    });
  }

  async update(
    id: string,
    data: {
      expiryDate?: Date;
      purchasePrice?: number;
      sellingPrice?: number;
    }
  ) {
    return prisma.batch.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }

  async findExpiring(daysAhead = 30) {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysAhead);

    return prisma.batch.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: thresholdDate,
        },
        quantity: { gt: 0 },
      },
      include: this.defaultInclude,
      orderBy: { expiryDate: 'asc' },
    });
  }

  async findExpired() {
    const now = new Date();

    return prisma.batch.findMany({
      where: {
        expiryDate: {
          lt: now,
        },
        quantity: { gt: 0 },
      },
      include: this.defaultInclude,
      orderBy: { expiryDate: 'asc' },
    });
  }

  async findFEFOCandidates(productId: string, requiredQuantity: number) {
    const now = new Date();

    // Select active, non-expired batches for productId ordered by expiryDate ASC
    const activeBatches = await prisma.batch.findMany({
      where: {
        productId,
        quantity: { gt: 0 },
        expiryDate: { gte: now },
      },
      include: this.defaultInclude,
      orderBy: { expiryDate: 'asc' },
    });

    const allocatedBatches: Array<{
      batch: typeof activeBatches[0];
      allocatedQuantity: number;
    }> = [];

    let remainingNeeded = requiredQuantity;

    for (const batch of activeBatches) {
      if (remainingNeeded <= 0) break;
      const takeQty = Math.min(batch.quantity, remainingNeeded);
      allocatedBatches.push({
        batch,
        allocatedQuantity: takeQty,
      });
      remainingNeeded -= takeQty;
    }

    return {
      allocatedBatches,
      fulfilled: remainingNeeded === 0,
      shortfall: remainingNeeded > 0 ? remainingNeeded : 0,
    };
  }
}

export const batchesRepository = new BatchesRepository();
