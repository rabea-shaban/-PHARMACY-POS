import { Prisma } from '@prisma/client';
import { SaleReturnQueryFilters } from './sale-returns.types.js';
export interface AtomicReturnPlan {
    saleId: string;
    customerId?: string | null;
    processedById: string;
    reason?: string | null;
    subtotal: number;
    tax: number;
    total: number;
    items: {
        saleItemId: string;
        productId: string;
        batchId: string | null;
        quantity: number;
        refundAmount: number;
    }[];
    commissionReversal?: {
        userId: string;
        ruleId?: string | null;
        rate: number;
        amount: number;
    } | null;
    loyaltyReversalPoints?: number;
}
export declare class SaleReturnsRepository {
    private readonly defaultInclude;
    findMany(filters: SaleReturnQueryFilters): Promise<{
        items: ({
            sale: {
                id: string;
                status: import("@prisma/client").$Enums.SaleStatus;
                invoiceNumber: string;
                total: Prisma.Decimal;
            };
            customer: {
                name: string;
                id: string;
                phone: string;
            } | null;
            items: ({
                batch: {
                    id: string;
                    expiryDate: Date;
                    batchNumber: string;
                } | null;
                product: {
                    name: string;
                    id: string;
                    barcode: string | null;
                };
                saleItem: {
                    id: string;
                    saleId: string;
                    productId: string;
                    batchId: string | null;
                    quantity: number;
                    discount: Prisma.Decimal;
                    tax: Prisma.Decimal;
                    total: Prisma.Decimal;
                    unitPrice: Prisma.Decimal;
                };
            } & {
                id: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                saleReturnId: string;
                saleItemId: string;
                refundAmount: Prisma.Decimal;
            })[];
            processedBy: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            reason: string | null;
            subtotal: Prisma.Decimal;
            tax: Prisma.Decimal;
            total: Prisma.Decimal;
            returnNumber: string;
            customerId: string | null;
            processedById: string;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        sale: {
            id: string;
            status: import("@prisma/client").$Enums.SaleStatus;
            invoiceNumber: string;
            total: Prisma.Decimal;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
        items: ({
            batch: {
                id: string;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            saleItem: {
                id: string;
                saleId: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                discount: Prisma.Decimal;
                tax: Prisma.Decimal;
                total: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
            };
        } & {
            id: string;
            productId: string;
            batchId: string | null;
            quantity: number;
            saleReturnId: string;
            saleItemId: string;
            refundAmount: Prisma.Decimal;
        })[];
        processedBy: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        saleId: string;
        reason: string | null;
        subtotal: Prisma.Decimal;
        tax: Prisma.Decimal;
        total: Prisma.Decimal;
        returnNumber: string;
        customerId: string | null;
        processedById: string;
    }) | null>;
    findBySaleId(saleId: string): Promise<({
        sale: {
            id: string;
            status: import("@prisma/client").$Enums.SaleStatus;
            invoiceNumber: string;
            total: Prisma.Decimal;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
        items: ({
            batch: {
                id: string;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            saleItem: {
                id: string;
                saleId: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                discount: Prisma.Decimal;
                tax: Prisma.Decimal;
                total: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
            };
        } & {
            id: string;
            productId: string;
            batchId: string | null;
            quantity: number;
            saleReturnId: string;
            saleItemId: string;
            refundAmount: Prisma.Decimal;
        })[];
        processedBy: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        saleId: string;
        reason: string | null;
        subtotal: Prisma.Decimal;
        tax: Prisma.Decimal;
        total: Prisma.Decimal;
        returnNumber: string;
        customerId: string | null;
        processedById: string;
    })[]>;
    findSaleWithItems(saleId: string): Promise<({
        returns: ({
            items: {
                id: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                saleReturnId: string;
                saleItemId: string;
                refundAmount: Prisma.Decimal;
            }[];
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            reason: string | null;
            subtotal: Prisma.Decimal;
            tax: Prisma.Decimal;
            total: Prisma.Decimal;
            returnNumber: string;
            customerId: string | null;
            processedById: string;
        })[];
        customer: {
            name: string;
            id: string;
            phone: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            tierId: string | null;
        } | null;
        items: ({
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
            } | null;
            product: {
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
            returnItems: {
                id: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                saleReturnId: string;
                saleItemId: string;
                refundAmount: Prisma.Decimal;
            }[];
        } & {
            id: string;
            saleId: string;
            productId: string;
            batchId: string | null;
            quantity: number;
            discount: Prisma.Decimal;
            tax: Prisma.Decimal;
            total: Prisma.Decimal;
            unitPrice: Prisma.Decimal;
        })[];
        commissionTransactions: {
            id: string;
            createdAt: Date;
            userId: string;
            saleId: string | null;
            commissionRuleId: string | null;
            salesAmount: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
            commissionRate: Prisma.Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.SaleStatus;
        invoiceNumber: string;
        subtotal: Prisma.Decimal;
        discount: Prisma.Decimal;
        tax: Prisma.Decimal;
        total: Prisma.Decimal;
        paidAmount: Prisma.Decimal;
        remainingAmount: Prisma.Decimal;
        customerId: string | null;
        discountReason: string | null;
        insuranceAmount: Prisma.Decimal;
    }) | null>;
    createSaleReturnAtomic(plan: AtomicReturnPlan): Promise<({
        sale: {
            id: string;
            status: import("@prisma/client").$Enums.SaleStatus;
            invoiceNumber: string;
            total: Prisma.Decimal;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
        items: ({
            batch: {
                id: string;
                expiryDate: Date;
                batchNumber: string;
            } | null;
            product: {
                name: string;
                id: string;
                barcode: string | null;
            };
            saleItem: {
                id: string;
                saleId: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                discount: Prisma.Decimal;
                tax: Prisma.Decimal;
                total: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
            };
        } & {
            id: string;
            productId: string;
            batchId: string | null;
            quantity: number;
            saleReturnId: string;
            saleItemId: string;
            refundAmount: Prisma.Decimal;
        })[];
        processedBy: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        saleId: string;
        reason: string | null;
        subtotal: Prisma.Decimal;
        tax: Prisma.Decimal;
        total: Prisma.Decimal;
        returnNumber: string;
        customerId: string | null;
        processedById: string;
    }) | null>;
}
export declare const saleReturnsRepository: SaleReturnsRepository;
