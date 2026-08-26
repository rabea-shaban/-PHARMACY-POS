import { Prisma, PurchaseStatus } from '@prisma/client';
import { PurchaseQueryFilters, ReceivePurchaseItemData } from './purchases.types.js';
export declare class PurchasesRepository {
    private readonly defaultInclude;
    findMany(filters: PurchaseQueryFilters): Promise<{
        items: ({
            supplier: {
                name: string;
                id: string;
                phone: string;
            };
            items: ({
                product: {
                    name: string;
                    id: string;
                    barcode: string | null;
                    sellingPrice: Prisma.Decimal;
                };
                batch: {
                    id: string;
                    quantity: number;
                    expiryDate: Date;
                    batchNumber: string;
                } | null;
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
    findById(id: string): Promise<({
        supplier: {
            name: string;
            id: string;
            phone: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
                sellingPrice: Prisma.Decimal;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
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
    }) | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<({
        supplier: {
            name: string;
            id: string;
            phone: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
                sellingPrice: Prisma.Decimal;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
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
    }) | null>;
    create(data: {
        supplierId: string;
        invoiceNumber: string;
        purchaseDate?: Date;
        subtotal: number;
        discount: number;
        tax: number;
        total: number;
        paidAmount: number;
        remainingAmount: number;
        status: PurchaseStatus;
        createdById: string;
        notes?: string | null;
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
            discount: number;
            tax: number;
            total: number;
            batchNumber?: string;
            expiryDate?: Date;
            sellingPrice?: number;
        }>;
    }): Promise<({
        supplier: {
            name: string;
            id: string;
            phone: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
                sellingPrice: Prisma.Decimal;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
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
    }) | null>;
    update(id: string, data: {
        notes?: string | null;
        discount?: number;
        tax?: number;
        paidAmount?: number;
        remainingAmount?: number;
        total?: number;
        status?: PurchaseStatus;
    }): Promise<{
        supplier: {
            name: string;
            id: string;
            phone: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
                sellingPrice: Prisma.Decimal;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
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
    }>;
    receiveAtomic(purchaseId: string, overrides?: ReceivePurchaseItemData[], actorId?: string | null): Promise<{
        supplier: {
            name: string;
            id: string;
            phone: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
                sellingPrice: Prisma.Decimal;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
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
    }>;
    cancelAtomic(purchaseId: string, reason?: string): Promise<{
        supplier: {
            name: string;
            id: string;
            phone: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                barcode: string | null;
                sellingPrice: Prisma.Decimal;
            };
            batch: {
                id: string;
                quantity: number;
                expiryDate: Date;
                batchNumber: string;
            } | null;
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
    }>;
}
export declare const purchasesRepository: PurchasesRepository;
