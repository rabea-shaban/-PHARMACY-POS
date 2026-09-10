import { prisma } from '../../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
export class InventoryRepository {
    defaultInclude = {
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
        branch: {
            select: {
                id: true,
                name: true,
                code: true,
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
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { productId, batchId, branchId, type, startDate, endDate, search, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const where = {};
        if (productId) {
            where.productId = productId;
        }
        if (batchId) {
            where.batchId = batchId;
        }
        if (branchId) {
            where.branchId = branchId;
        }
        if (type) {
            where.type = type;
        }
        if (search) {
            where.OR = [
                { reason: { contains: search } },
                { referenceId: { contains: search } },
                { product: { name: { contains: search } } },
                { product: { barcode: { contains: search } } },
                { batch: { batchNumber: { contains: search } } },
            ];
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
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
    async findByProductId(productId, page = 1, limit = 20) {
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
    async findByBatchId(batchId, page = 1, limit = 20) {
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
    async findMatrix(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Number(query.limit) || 20);
        const skip = (page - 1) * limit;
        const [branches, productsResult] = await Promise.all([
            prisma.branch.findMany({
                where: { isActive: true },
                select: { id: true, name: true, code: true, isMain: true },
                orderBy: [{ isMain: 'desc' }, { name: 'asc' }],
            }),
            (async () => {
                const where = {
                    isActive: true,
                    ...(query.categoryId && { categoryId: query.categoryId }),
                    ...(query.search && {
                        OR: [
                            { name: { contains: query.search } },
                            { barcode: { contains: query.search } },
                            { scientificName: { contains: query.search } },
                        ],
                    }),
                };
                const [items, total] = await Promise.all([
                    prisma.product.findMany({
                        where,
                        include: {
                            category: { select: { id: true, name: true } },
                            batches: {
                                select: {
                                    id: true,
                                    branchId: true,
                                    quantity: true,
                                    expiryDate: true,
                                    sellingPrice: true,
                                },
                            },
                        },
                        skip,
                        take: limit,
                        orderBy: { name: 'asc' },
                    }),
                    prisma.product.count({ where }),
                ]);
                return { items, total };
            })(),
        ]);
        const matrixItems = productsResult.items.map((prod) => {
            const branchStockMap = {};
            for (const br of branches) {
                branchStockMap[br.id] = { stock: 0, batchesCount: 0, nearestExpiry: null };
            }
            let totalStock = 0;
            for (const batch of prod.batches) {
                const brId = batch.branchId || branches[0]?.id;
                if (brId && branchStockMap[brId]) {
                    branchStockMap[brId].stock += batch.quantity;
                    branchStockMap[brId].batchesCount += 1;
                    if (!branchStockMap[brId].nearestExpiry || batch.expiryDate < branchStockMap[brId].nearestExpiry) {
                        branchStockMap[brId].nearestExpiry = batch.expiryDate;
                    }
                }
                totalStock += batch.quantity;
            }
            return {
                id: prod.id,
                name: prod.name,
                barcode: prod.barcode,
                scientificName: prod.scientificName,
                category: prod.category,
                sellingPrice: Number(prod.sellingPrice),
                minimumStock: prod.minimumStock,
                totalStock,
                isLowStock: totalStock <= prod.minimumStock,
                branchStock: branches.map((br) => ({
                    branchId: br.id,
                    branchName: br.name,
                    branchCode: br.code,
                    isMain: br.isMain,
                    stock: branchStockMap[br.id]?.stock || 0,
                    batchesCount: branchStockMap[br.id]?.batchesCount || 0,
                    nearestExpiry: branchStockMap[br.id]?.nearestExpiry || null,
                })),
            };
        });
        let filteredItems = matrixItems;
        if (query.lowStockOnly) {
            filteredItems = matrixItems.filter((i) => i.isLowStock);
        }
        return {
            branches,
            items: filteredItems,
            total: productsResult.total,
        };
    }
    async recordStockMovementAtomic(params) {
        const { productId, batchId, branchId, quantityDelta, type, reason, referenceType, referenceId, actorId } = params;
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
                throw new BadRequestError(`Insufficient stock in batch '${batch.batchNumber}'. Current available is ${batch.quantity} units, attempted reduction is ${Math.abs(quantityDelta)} units.`);
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
                    branchId: branchId || batch.branchId || null,
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
//# sourceMappingURL=inventory.repository.js.map