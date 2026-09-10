import { Prisma } from '@prisma/client';
import { BatchQueryFilters } from './batches.types.js';
export declare class BatchesRepository {
    private readonly defaultInclude;
    findMany(filters: BatchQueryFilters): Promise<{
        items: ({
            product: {
                name: string;
                id: string;
                category: {
                    name: string;
                    id: string;
                };
                barcode: string | null;
            };
        } & {
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        product: {
            name: string;
            id: string;
            category: {
                name: string;
                id: string;
            };
            barcode: string | null;
        };
    } & {
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
    }) | null>;
    findByProductAndBatchNumber(productId: string, batchNumber: string): Promise<({
        product: {
            name: string;
            id: string;
            category: {
                name: string;
                id: string;
            };
            barcode: string | null;
        };
    } & {
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
    }) | null>;
    findByProductId(productId: string): Promise<({
        product: {
            name: string;
            id: string;
            category: {
                name: string;
                id: string;
            };
            barcode: string | null;
        };
    } & {
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
    })[]>;
    create(data: {
        productId: string;
        batchNumber: string;
        expiryDate: Date;
        quantity: number;
        purchasePrice: number;
        sellingPrice: number;
        actorId?: string | null;
    }): Promise<{
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
    }>;
    update(id: string, data: {
        expiryDate?: Date;
        purchasePrice?: number;
        sellingPrice?: number;
    }): Promise<{
        product: {
            name: string;
            id: string;
            category: {
                name: string;
                id: string;
            };
            barcode: string | null;
        };
    } & {
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
    }>;
    findExpiring(daysAhead?: number): Promise<({
        product: {
            name: string;
            id: string;
            category: {
                name: string;
                id: string;
            };
            barcode: string | null;
        };
    } & {
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
    })[]>;
    findExpired(): Promise<({
        product: {
            name: string;
            id: string;
            category: {
                name: string;
                id: string;
            };
            barcode: string | null;
        };
    } & {
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
    })[]>;
    findFEFOCandidates(productId: string, requiredQuantity: number): Promise<{
        allocatedBatches: {
            batch: {
                product: {
                    name: string;
                    id: string;
                    category: {
                        name: string;
                        id: string;
                    };
                    barcode: string | null;
                };
            } & {
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
            allocatedQuantity: number;
        }[];
        fulfilled: boolean;
        shortfall: number;
    }>;
}
export declare const batchesRepository: BatchesRepository;
