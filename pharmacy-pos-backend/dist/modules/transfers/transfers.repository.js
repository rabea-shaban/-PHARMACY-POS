import { prisma } from '../../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
export const transferIncludes = {
    fromBranch: {
        select: {
            id: true,
            name: true,
            code: true,
            phone: true,
        },
    },
    toBranch: {
        select: {
            id: true,
            name: true,
            code: true,
            phone: true,
        },
    },
    requestedBy: {
        select: {
            id: true,
            name: true,
            role: true,
        },
    },
    approvedBy: {
        select: {
            id: true,
            name: true,
            role: true,
        },
    },
    dispatchedBy: {
        select: {
            id: true,
            name: true,
            role: true,
        },
    },
    receivedBy: {
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
                    scientificName: true,
                    barcode: true,
                },
            },
            batch: {
                select: {
                    id: true,
                    batchNumber: true,
                    expiryDate: true,
                    quantity: true,
                    purchasePrice: true,
                    sellingPrice: true,
                },
            },
        },
    },
};
export class TransfersRepository {
    async generateTransferNumber() {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `TRF-${dateStr}-${Date.now().toString().slice(-4)}${rand}`;
    }
    async findAll(query = {}) {
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Number(query?.limit) || 20);
        const skip = Math.max(0, (page - 1) * limit);
        const fromBranchId = query?.fromBranchId;
        const toBranchId = query?.toBranchId;
        const branchId = query?.branchId;
        const status = query?.status;
        const search = query?.search;
        const sortBy = query?.sortBy || 'createdAt';
        const sortOrder = query?.sortOrder || 'desc';
        const where = {
            ...(fromBranchId && { fromBranchId }),
            ...(toBranchId && { toBranchId }),
            ...(branchId && {
                OR: [{ fromBranchId: branchId }, { toBranchId: branchId }],
            }),
            ...(status && { status }),
            ...(search && {
                OR: [
                    { transferNumber: { contains: search } },
                    { notes: { contains: search } },
                    { rejectionReason: { contains: search } },
                    { fromBranch: { name: { contains: search } } },
                    { toBranch: { name: { contains: search } } },
                ],
            }),
        };
        const [transfers, total] = await Promise.all([
            prisma.transferRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: transferIncludes,
            }),
            prisma.transferRequest.count({ where }),
        ]);
        return { transfers, total };
    }
    async findById(id) {
        return prisma.transferRequest.findUnique({
            where: { id },
            include: transferIncludes,
        });
    }
    async findByTransferNumber(transferNumber) {
        return prisma.transferRequest.findUnique({
            where: { transferNumber },
            include: transferIncludes,
        });
    }
    async create(data, requestedById) {
        const transferNumber = await this.generateTransferNumber();
        return prisma.$transaction(async (tx) => {
            // Create transfer record
            const transfer = await tx.transferRequest.create({
                data: {
                    transferNumber,
                    fromBranchId: data.fromBranchId,
                    toBranchId: data.toBranchId,
                    requestedById,
                    notes: data.notes,
                    status: 'PENDING',
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            batchId: item.batchId,
                            quantity: item.quantity,
                            unitCost: item.unitCost || 0,
                            notes: item.notes,
                        })),
                    },
                },
                include: transferIncludes,
            });
            return transfer;
        }, { maxWait: 15000, timeout: 20000 });
    }
    async approve(id, approvedById) {
        return prisma.transferRequest.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedById,
                approvedAt: new Date(),
            },
            include: transferIncludes,
        });
    }
    async dispatchAtomic(id, dispatchedById) {
        return prisma.$transaction(async (tx) => {
            const transfer = await tx.transferRequest.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            batch: true,
                            product: true,
                        },
                    },
                    fromBranch: true,
                    toBranch: true,
                },
            });
            if (!transfer) {
                throw new NotFoundError(`Transfer request with ID '${id}' not found`);
            }
            if (transfer.status !== 'APPROVED' && transfer.status !== 'PENDING') {
                throw new BadRequestError(`Cannot dispatch transfer with status '${transfer.status}'`);
            }
            // Decrement stock from origin branch batches and create TRANSFER_OUT ledger records
            for (const item of transfer.items) {
                let sourceBatch = item.batch;
                if (!sourceBatch) {
                    // Find earliest expiring batch for this product in the origin branch with available stock
                    sourceBatch = await tx.batch.findFirst({
                        where: {
                            productId: item.productId,
                            branchId: transfer.fromBranchId,
                            quantity: { gte: item.quantity },
                        },
                        orderBy: [{ expiryDate: 'asc' }, { createdAt: 'asc' }],
                    });
                    if (!sourceBatch) {
                        throw new BadRequestError(`Insufficient stock for product '${item.product.name}' in source branch '${transfer.fromBranch.name}'`);
                    }
                    // Link batch to item
                    await tx.transferRequestItem.update({
                        where: { id: item.id },
                        data: { batchId: sourceBatch.id },
                    });
                }
                else {
                    // Verify batch stock
                    if (sourceBatch.quantity < item.quantity) {
                        throw new BadRequestError(`Insufficient stock in batch '${sourceBatch.batchNumber}' for product '${item.product.name}'. Available: ${sourceBatch.quantity}, Requested: ${item.quantity}`);
                    }
                }
                // Decrement origin batch
                await tx.batch.update({
                    where: { id: sourceBatch.id },
                    data: { quantity: sourceBatch.quantity - item.quantity },
                });
                // Record TRANSFER_OUT inventory transaction
                await tx.inventoryTransaction.create({
                    data: {
                        productId: item.productId,
                        batchId: sourceBatch.id,
                        branchId: transfer.fromBranchId,
                        quantity: -item.quantity,
                        type: 'TRANSFER_OUT',
                        reason: `Transfer to branch ${transfer.toBranch.name} (${transfer.transferNumber})`,
                        referenceType: 'TRANSFER',
                        referenceId: transfer.transferNumber,
                        createdById: dispatchedById,
                    },
                });
            }
            // Update transfer status
            const updatedTransfer = await tx.transferRequest.update({
                where: { id },
                data: {
                    status: 'IN_TRANSIT',
                    dispatchedById,
                    dispatchedAt: new Date(),
                },
                include: transferIncludes,
            });
            return updatedTransfer;
        }, { maxWait: 15000, timeout: 20000 });
    }
    async receiveAtomic(id, receivedById) {
        return prisma.$transaction(async (tx) => {
            const transfer = await tx.transferRequest.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            batch: true,
                            product: true,
                        },
                    },
                    fromBranch: true,
                    toBranch: true,
                },
            });
            if (!transfer) {
                throw new NotFoundError(`Transfer request with ID '${id}' not found`);
            }
            if (transfer.status !== 'IN_TRANSIT') {
                throw new BadRequestError(`Cannot receive transfer with status '${transfer.status}'. It must be IN_TRANSIT.`);
            }
            const now = new Date();
            // Increment stock in destination branch batches and create TRANSFER_IN ledger records
            for (const item of transfer.items) {
                const originBatch = item.batch;
                const baseBatchNumber = originBatch ? originBatch.batchNumber : `BATCH-${now.getFullYear()}`;
                const expiryDate = originBatch ? originBatch.expiryDate : new Date(now.getFullYear() + 2, 11, 31);
                const purchasePrice = originBatch ? originBatch.purchasePrice : item.unitCost;
                const sellingPrice = originBatch ? originBatch.sellingPrice : item.product.sellingPrice;
                // Check if origin batch was fully transferred and has 0 quantity at origin
                let destBatch = await tx.batch.findFirst({
                    where: {
                        productId: item.productId,
                        branchId: transfer.toBranchId,
                    },
                });
                if (destBatch) {
                    destBatch = await tx.batch.update({
                        where: { id: destBatch.id },
                        data: { quantity: destBatch.quantity + item.quantity },
                    });
                }
                else if (originBatch && originBatch.quantity === 0 && originBatch.branchId === transfer.fromBranchId) {
                    // Source batch is empty, safely reassign to destination branch
                    destBatch = await tx.batch.update({
                        where: { id: originBatch.id },
                        data: {
                            branchId: transfer.toBranchId,
                            quantity: item.quantity,
                        },
                    });
                }
                else {
                    // Partial transfer: create a distinct branch batch entry
                    const newBatchNumber = `${baseBatchNumber}-${transfer.toBranch.code || 'B'}`;
                    const existingCodeBatch = await tx.batch.findFirst({
                        where: { productId: item.productId, batchNumber: newBatchNumber },
                    });
                    if (existingCodeBatch) {
                        destBatch = await tx.batch.update({
                            where: { id: existingCodeBatch.id },
                            data: { quantity: existingCodeBatch.quantity + item.quantity },
                        });
                    }
                    else {
                        destBatch = await tx.batch.create({
                            data: {
                                productId: item.productId,
                                branchId: transfer.toBranchId,
                                batchNumber: newBatchNumber,
                                expiryDate,
                                quantity: item.quantity,
                                purchasePrice,
                                sellingPrice,
                            },
                        });
                    }
                }
                // Record TRANSFER_IN inventory transaction
                await tx.inventoryTransaction.create({
                    data: {
                        productId: item.productId,
                        batchId: destBatch.id,
                        branchId: transfer.toBranchId,
                        quantity: item.quantity,
                        type: 'TRANSFER_IN',
                        reason: `Transfer received from branch ${transfer.fromBranch.name} (${transfer.transferNumber})`,
                        referenceType: 'TRANSFER',
                        referenceId: transfer.transferNumber,
                        createdById: receivedById,
                    },
                });
            }
            // Mark transfer as COMPLETED
            const completedTransfer = await tx.transferRequest.update({
                where: { id },
                data: {
                    status: 'COMPLETED',
                    receivedById,
                    receivedAt: now,
                    completedAt: now,
                },
                include: transferIncludes,
            });
            return completedTransfer;
        }, { maxWait: 15000, timeout: 20000 });
    }
    async reject(id, reason) {
        return prisma.transferRequest.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectionReason: reason,
            },
            include: transferIncludes,
        });
    }
    async cancel(id) {
        return prisma.transferRequest.update({
            where: { id },
            data: {
                status: 'CANCELLED',
            },
            include: transferIncludes,
        });
    }
}
export const transfersRepository = new TransfersRepository();
//# sourceMappingURL=transfers.repository.js.map