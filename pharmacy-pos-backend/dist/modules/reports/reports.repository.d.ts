import { Prisma } from '@prisma/client';
import { SalesReportQueryFilters, ProductReportQueryFilters, InventoryReportQueryFilters, PurchaseReportQueryFilters, ExpenseReportQueryFilters, CustomerReportQueryFilters, StaffReportQueryFilters } from './reports.types.js';
export declare class ReportsRepository {
    getSalesReportData(filters: SalesReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        allMatchingSales: ({
            items: ({
                product: {
                    name: string;
                    id: string;
                    category: {
                        name: string;
                        id: string;
                    };
                    barcode: string | null;
                    categoryId: string;
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
        totalInvoicesCount: number;
        paginatedSales: ({
            user: {
                name: string;
            };
            customer: {
                name: string;
            } | null;
            items: {
                id: string;
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
        })[];
        allReturns: {
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
        }[];
        allPayments: {
            id: string;
            createdAt: Date;
            saleId: string;
            amount: Prisma.Decimal;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            createdById: string;
            referenceNumber: string | null;
            notes: string | null;
        }[];
    }>;
    getProductPerformanceData(filters: ProductReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        products: ({
            category: {
                name: string;
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
        })[];
        saleItems: ({
            sale: {
                createdAt: Date;
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
        returnItems: {
            id: string;
            productId: string;
            batchId: string | null;
            quantity: number;
            saleReturnId: string;
            saleItemId: string;
            refundAmount: Prisma.Decimal;
        }[];
    }>;
    getInventoryReportData(filters: InventoryReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        products: ({
            category: {
                name: string;
            };
            batches: {
                id: string;
                quantity: number;
                expiryDate: Date;
                purchasePrice: Prisma.Decimal;
                sellingPrice: Prisma.Decimal;
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
        activeBatches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
        }[];
        inventoryTransactions: {
            quantity: number;
            type: import("@prisma/client").$Enums.InventoryTransactionType;
        }[];
    }>;
    getPurchaseReportData(filters: PurchaseReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        purchases: ({
            supplier: {
                name: string;
                id: string;
                phone: string;
            };
            items: {
                id: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                discount: Prisma.Decimal;
                tax: Prisma.Decimal;
                total: Prisma.Decimal;
                purchaseId: string;
                unitCost: Prisma.Decimal;
            }[];
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
    }>;
    getExpenseReportData(filters: ExpenseReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: Prisma.Decimal;
            category: import("@prisma/client").$Enums.ExpenseCategory;
            description: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            expenseDate: Date;
            createdById: string;
        }[];
    }>;
    getCustomerReportData(_filters: CustomerReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        allCustomers: ({
            loyaltyAccount: {
                totalPoints: number;
            } | null;
            tier: {
                name: string;
            } | null;
            sales: {
                id: string;
                total: Prisma.Decimal;
            }[];
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
            dateOfBirth: Date | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            tierId: string | null;
        })[];
        newCustomersCount: number;
        loyaltyTransactions: {
            type: import("@prisma/client").$Enums.LoyaltyTransactionType;
            points: number;
        }[];
        tiers: ({
            _count: {
                customers: number;
            };
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        })[];
    }>;
    getStaffReportData(filters: StaffReportQueryFilters, startDate: Date, endDate: Date): Promise<{
        staffUsers: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        }[];
        sales: {
            id: string;
            userId: string;
            total: Prisma.Decimal;
        }[];
        commissionTxs: {
            id: string;
            userId: string;
            salesAmount: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
        }[];
    }>;
    getFinancialSummaryData(startDate: Date, endDate: Date): Promise<{
        sales: {
            total: Prisma.Decimal;
        }[];
        returns: {
            total: Prisma.Decimal;
        }[];
        purchases: {
            total: Prisma.Decimal;
        }[];
        expenses: {
            amount: Prisma.Decimal;
        }[];
        commissions: {
            commissionAmount: Prisma.Decimal;
        }[];
    }>;
}
export declare const reportsRepository: ReportsRepository;
