import { InventoryTransactionType, Prisma } from '@prisma/client';
import { InventoryTransactionQueryDTO, InventoryMatrixQueryDTO } from './inventory.validator.js';
export declare class InventoryRepository {
    private readonly defaultInclude;
    findMany(filters: InventoryTransactionQueryDTO): Promise<{
        items: ({
            batch: {
                id: string;
                quantity: number;
                batchNumber: string;
                expiryDate: Date;
            } | null;
            branch: {
                name: string;
                id: string;
                code: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
            branchId: string | null;
            createdAt: Date;
            createdById: string | null;
            productId: string;
            batchId: string | null;
            quantity: number;
            type: import("@prisma/client").$Enums.InventoryTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
        })[];
        total: number;
    }>;
    findByProductId(productId: string, page?: number, limit?: number): Promise<{
        items: ({
            batch: {
                id: string;
                quantity: number;
                batchNumber: string;
                expiryDate: Date;
            } | null;
            branch: {
                name: string;
                id: string;
                code: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
            branchId: string | null;
            createdAt: Date;
            createdById: string | null;
            productId: string;
            batchId: string | null;
            quantity: number;
            type: import("@prisma/client").$Enums.InventoryTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
        })[];
        total: number;
    }>;
    findByBatchId(batchId: string, page?: number, limit?: number): Promise<{
        items: ({
            batch: {
                id: string;
                quantity: number;
                batchNumber: string;
                expiryDate: Date;
            } | null;
            branch: {
                name: string;
                id: string;
                code: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
            branchId: string | null;
            createdAt: Date;
            createdById: string | null;
            productId: string;
            batchId: string | null;
            quantity: number;
            type: import("@prisma/client").$Enums.InventoryTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
        })[];
        total: number;
    }>;
    findMatrix(query: InventoryMatrixQueryDTO): Promise<{
        branches: {
            name: string;
            id: string;
            code: string;
            isMain: boolean;
        }[];
        items: {
            id: string;
            name: string;
            barcode: string | null;
            scientificName: string | null;
            category: {
                name: string;
                id: string;
            };
            sellingPrice: number;
            minimumStock: number;
            totalStock: number;
            isLowStock: boolean;
            branchStock: {
                branchId: string;
                branchName: string;
                branchCode: string;
                isMain: boolean;
                stock: number;
                batchesCount: number;
                nearestExpiry: Date | null;
            }[];
        }[];
        total: number;
    }>;
    recordStockMovementAtomic(params: {
        productId: string;
        batchId: string;
        branchId?: string | null;
        quantityDelta: number;
        type: InventoryTransactionType;
        reason: string;
        referenceType?: string | null;
        referenceId?: string | null;
        actorId?: string | null;
    }): Promise<{
        batch: {
            id: string;
            branchId: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            batchNumber: string;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
        };
        transaction: {
            batch: {
                id: string;
                quantity: number;
                batchNumber: string;
                expiryDate: Date;
            } | null;
            branch: {
                name: string;
                id: string;
                code: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
            branchId: string | null;
            createdAt: Date;
            createdById: string | null;
            productId: string;
            batchId: string | null;
            quantity: number;
            type: import("@prisma/client").$Enums.InventoryTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
        };
        newQuantity: number;
    }>;
}
export declare const inventoryRepository: InventoryRepository;
