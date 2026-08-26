import { Prisma } from '@prisma/client';
import { ProductQueryFilters, ProductSearchQueryFilters } from './products.types.js';
export declare class ProductsRepository {
    private readonly defaultInclude;
    findMany(filters: ProductQueryFilters): Promise<{
        items: ({
            category: {
                name: string;
                id: string;
            };
            batches: {
                id: string;
                quantity: number;
                expiryDate: Date;
                purchasePrice: Prisma.Decimal;
                sellingPrice: Prisma.Decimal;
                batchNumber: string;
            }[];
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            barcode: string | null;
            scientificName: string | null;
            categoryId: string;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            taxRate: Prisma.Decimal;
            minimumStock: number;
        })[];
        total: number;
    }>;
    searchPOS(filters: ProductSearchQueryFilters): Promise<({
        category: {
            name: string;
            id: string;
        };
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    })[]>;
    findById(id: string): Promise<({
        category: {
            name: string;
            id: string;
        };
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    }) | null>;
    findByBarcode(barcode: string): Promise<({
        category: {
            name: string;
            id: string;
        };
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    }) | null>;
    create(data: {
        name: string;
        barcode?: string | null;
        scientificName?: string | null;
        description?: string | null;
        categoryId: string;
        purchasePrice: number;
        sellingPrice: number;
        taxRate?: number;
        minimumStock?: number;
    }): Promise<{
        category: {
            name: string;
            id: string;
        };
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    }>;
    update(id: string, data: {
        name?: string;
        barcode?: string | null;
        scientificName?: string | null;
        description?: string | null;
        categoryId?: string;
        purchasePrice?: number;
        sellingPrice?: number;
        taxRate?: number;
        minimumStock?: number;
        isActive?: boolean;
    }): Promise<{
        category: {
            name: string;
            id: string;
        };
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    }>;
    softDelete(id: string): Promise<{
        category: {
            name: string;
            id: string;
        };
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            batchNumber: string;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    }>;
    findLowStock(): Promise<({
        category: {
            name: string;
            id: string;
        };
        batches: {
            quantity: number;
            expiryDate: Date;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        barcode: string | null;
        scientificName: string | null;
        categoryId: string;
        purchasePrice: Prisma.Decimal;
        sellingPrice: Prisma.Decimal;
        taxRate: Prisma.Decimal;
        minimumStock: number;
    })[]>;
    findExpiring(daysAhead?: number): Promise<({
        product: {
            category: {
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            barcode: string | null;
            scientificName: string | null;
            categoryId: string;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            taxRate: Prisma.Decimal;
            minimumStock: number;
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
}
export declare const productsRepository: ProductsRepository;
