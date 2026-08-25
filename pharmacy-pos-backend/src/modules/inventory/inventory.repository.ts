import { InventoryTransactionType, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { InventoryTransactionQueryFilters } from './inventory.types.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export class InventoryRepository {
  private readonly defaultInclude = {
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
        quantity: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        name: true,
        role: true,
      },
    },
  };

  async findMany(filters: InventoryTransactionQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { productId, batchId, type, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const where: Prisma.InventoryTransactionWhereInput = {};

    if (productId) {
      where.productId = productId;
    }

    if (batchId) {
      where.batchId = batchId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.inventoryTransaction.count({ where }),
    ]);

    return { items, total };
  }

  async findByProductId(productId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where: { productId },
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventoryTransaction.count({ where: { productId } }),
    ]);

    return { items, total };
  }

  async findByBatchId(batchId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where: { batchId },
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventoryTransaction.count({ where: { batchId } }),
    ]);

    return { items, total };
  }

  async recordStockMovementAtomic(params: {
    productId: string;
    batchId: string;
    quantityDelta: number;
    type: InventoryTransactionType;
    reason: string;
    referenceType?: string | null;
    referenceId?: string | null;
    actorId?: string | null;
  }) {
    const { productId, batchId, quantityDelta, type, reason, referenceType, referenceId, actorId } = params;

    return prisma.$transaction(async (tx) => {
      // 1. Find batch
      const batch = await tx.batch.findUnique({
        where: { id: batchId },
        include: { product: true },
      });

      if (!batch) {
        throw new NotFoundError(`Batch with ID '${batchId}' not found`);
      }

      if (batch.productId !== productId) {
        throw new BadRequestError(`Batch '${batch.batchNumber}' does not belong to product ID '${productId}'`);
      }

      // 2. Validate stock quantity
      const newQuantity = batch.quantity + quantityDelta;
      if (newQuantity < 0) {
        throw new BadRequestError(
          `Insufficient stock in batch '${batch.batchNumber}'. Current available is ${batch.quantity} units, attempted reduction is ${Math.abs(quantityDelta)} units.`
        );
      }

      // 3. Update batch quantity
      const updatedBatch = await tx.batch.update({
        where: { id: batchId },
        data: { quantity: newQuantity },
      });

      // 4. Create immutable inventory transaction record
      const transaction = await tx.inventoryTransaction.create({
        data: {
          productId,
          batchId,
          quantity: quantityDelta,
          type,
          reason,
          referenceType: referenceType || null,
          referenceId: referenceId || null,
          createdById: actorId || null,
        },
        include: this.defaultInclude,
      });

      return {
        batch: updatedBatch,
        transaction,
        newQuantity,
      };
    });
  }
}

export const inventoryRepository = new InventoryRepository();
