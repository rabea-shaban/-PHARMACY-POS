import { Prisma } from '@prisma/client';
import { SupplierQueryFilters } from './suppliers.types.js';
export declare class SuppliersRepository {
    findMany(filters: SupplierQueryFilters): Promise<{
        items: ({
            purchases: {
                total: Prisma.Decimal;
            }[];
            _count: {
                purchases: number;
            };
        } & {
            name: string;
            id: string;
            phone: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            taxNumber: string | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        purchases: {
            total: Prisma.Decimal;
        }[];
        _count: {
            purchases: number;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        taxNumber: string | null;
    }) | null>;
    findByPhone(phone: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        taxNumber: string | null;
    } | null>;
    create(data: {
        name: string;
        phone: string;
        email?: string | null;
        address?: string | null;
        taxNumber?: string | null;
        notes?: string | null;
    }): Promise<{
        purchases: {
            total: Prisma.Decimal;
        }[];
        _count: {
            purchases: number;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        taxNumber: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        email?: string | null;
        address?: string | null;
        taxNumber?: string | null;
        notes?: string | null;
        isActive?: boolean;
    }): Promise<{
        purchases: {
            total: Prisma.Decimal;
        }[];
        _count: {
            purchases: number;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        taxNumber: string | null;
    }>;
    softDelete(id: string): Promise<{
        purchases: {
            total: Prisma.Decimal;
        }[];
        _count: {
            purchases: number;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        taxNumber: string | null;
    }>;
    findPurchases(supplierId: string, page?: number, limit?: number): Promise<{
        items: ({
            items: ({
                batch: {
                    id: string;
                    batchNumber: string;
                    expiryDate: Date;
                } | null;
                product: {
                    name: string;
                    id: string;
                    barcode: string | null;
                };
            } & {
                id: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                discount: Prisma.Decimal;
                tax: Prisma.Decimal;
                total: Prisma.Decimal;
                purchaseId: string;
                unitCost: Prisma.Decimal;
            })[];
            createdBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            branchId: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: string;
            notes: string | null;
            status: import("@prisma/client").$Enums.PurchaseStatus;
            supplierId: string;
            invoiceNumber: string;
            purchaseDate: Date;
            subtotal: Prisma.Decimal;
            discount: Prisma.Decimal;
            tax: Prisma.Decimal;
            total: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            remainingAmount: Prisma.Decimal;
        })[];
        total: number;
    }>;
}
export declare const suppliersRepository: SuppliersRepository;
