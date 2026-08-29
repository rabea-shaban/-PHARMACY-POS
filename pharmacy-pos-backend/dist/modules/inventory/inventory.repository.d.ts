import { InventoryTransactionType, Prisma } from '@prisma/client';
import { InventoryTransactionQueryFilters } from './inventory.types.js';
export declare class InventoryRepository {
    private readonly defaultInclude;
    findMany(filters: InventoryTransactionQueryFilters): Promise<{
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
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
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
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
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
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
    recordStockMovementAtomic(params: {
        productId: string;
        batchId: string;
        quantityDelta: number;
        type: InventoryTransactionType;
        reason: string;
        referenceType?: string | null;
        referenceId?: string | null;
        actorId?: string | null;
    }): Promise<{
        batch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        };
        transaction: {
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
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
