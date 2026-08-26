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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        expiryDate: Date;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        batchNumber: string;
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
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                expiryDate: Date;
                purchasePrice: Prisma.Decimal;
                sellingPrice: Prisma.Decimal;
                batchNumber: string;
            };
            allocatedQuantity: number;
        }[];
        fulfilled: boolean;
        shortfall: number;
    }>;
}
export declare const batchesRepository: BatchesRepository;
