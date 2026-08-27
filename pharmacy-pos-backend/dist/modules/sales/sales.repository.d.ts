import { Prisma, PaymentMethod } from '@prisma/client';
import { SaleQueryFilters } from './sales.types.js';
export interface AtomicCheckoutPlan {
    customerId?: string | null;
    cashierId: string;
    subtotal: number;
    discount: number;
    discountReason?: string | null;
    insuranceAmount: number;
    tax: number;
    total: number;
    paidAmount: number;
    remainingAmount: number;
    notes?: string | null;
    items: {
        productId: string;
        batchId: string | null;
        quantity: number;
        unitPrice: number;
        discount: number;
        tax: number;
        total: number;
    }[];
    payments: {
        paymentMethod: PaymentMethod;
        amount: number;
        referenceNumber?: string | null;
        notes?: string | null;
    }[];
    insurance?: {
        insuranceProviderId: string;
        coveredAmount: number;
        customerAmount: number;
        coveragePercentage: number;
        claimReference?: string | null;
    } | null;
    loyalty?: {
        redeemPoints?: number;
        pointsEarned?: number;
        pointsToCurrencyRate?: number;
        currencyToPointsRate?: number;
    } | null;
    commission?: {
        ruleId?: string | null;
        rate: number;
        amount: number;
    } | null;
}
export declare class SalesRepository {
    private readonly defaultInclude;
    findMany(filters: SaleQueryFilters): Promise<{
        items: ({
            user: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            };
            customer: {
                name: string;
                id: string;
                phone: string;
                tier: {
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    discountPercentage: Prisma.Decimal;
                    minimumPoints: number;
                } | null;
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
            payments: ({
                createdBy: {
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                saleId: string;
                amount: Prisma.Decimal;
                paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
                createdById: string;
                referenceNumber: string | null;
                notes: string | null;
            })[];
            insurance: ({
                insuranceProvider: {
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                saleId: string;
                insuranceProviderId: string;
                coveragePercentage: Prisma.Decimal;
                coveredAmount: Prisma.Decimal;
                customerAmount: Prisma.Decimal;
                claimReference: string | null;
            }) | null;
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        user: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
            tier: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                discountPercentage: Prisma.Decimal;
                minimumPoints: number;
            } | null;
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
        payments: ({
            createdBy: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            amount: Prisma.Decimal;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            createdById: string;
            referenceNumber: string | null;
            notes: string | null;
        })[];
        insurance: ({
            insuranceProvider: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            insuranceProviderId: string;
            coveragePercentage: Prisma.Decimal;
            coveredAmount: Prisma.Decimal;
            customerAmount: Prisma.Decimal;
            claimReference: string | null;
        }) | null;
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
    findByInvoiceNumber(invoiceNumber: string): Promise<({
        user: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
            tier: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                discountPercentage: Prisma.Decimal;
                minimumPoints: number;
            } | null;
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
        payments: ({
            createdBy: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            amount: Prisma.Decimal;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            createdById: string;
            referenceNumber: string | null;
            notes: string | null;
        })[];
        insurance: ({
            insuranceProvider: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            insuranceProviderId: string;
            coveragePercentage: Prisma.Decimal;
            coveredAmount: Prisma.Decimal;
            customerAmount: Prisma.Decimal;
            claimReference: string | null;
        }) | null;
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
    createSaleAtomic(plan: AtomicCheckoutPlan): Promise<({
        user: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
            tier: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                discountPercentage: Prisma.Decimal;
                minimumPoints: number;
            } | null;
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
        payments: ({
            createdBy: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            amount: Prisma.Decimal;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            createdById: string;
            referenceNumber: string | null;
            notes: string | null;
        })[];
        insurance: ({
            insuranceProvider: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            insuranceProviderId: string;
            coveragePercentage: Prisma.Decimal;
            coveredAmount: Prisma.Decimal;
            customerAmount: Prisma.Decimal;
            claimReference: string | null;
        }) | null;
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
    cancelSaleAtomic(saleId: string, actorId: string, reason: string): Promise<{
        user: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
        customer: {
            name: string;
            id: string;
            phone: string;
            tier: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                discountPercentage: Prisma.Decimal;
                minimumPoints: number;
            } | null;
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
        payments: ({
            createdBy: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            amount: Prisma.Decimal;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            createdById: string;
            referenceNumber: string | null;
            notes: string | null;
        })[];
        insurance: ({
            insuranceProvider: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            insuranceProviderId: string;
            coveragePercentage: Prisma.Decimal;
            coveredAmount: Prisma.Decimal;
            customerAmount: Prisma.Decimal;
            claimReference: string | null;
        }) | null;
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
    }>;
}
export declare const salesRepository: SalesRepository;
