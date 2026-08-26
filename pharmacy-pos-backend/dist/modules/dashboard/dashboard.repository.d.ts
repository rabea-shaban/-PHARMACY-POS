export declare class DashboardRepository {
    getDashboardData(startDate: Date, endDate: Date): Promise<{
        sales: ({
            items: ({
                batch: {
                    purchasePrice: import("@prisma/client-runtime-utils").Decimal;
                } | null;
            } & {
                id: string;
                saleId: string;
                productId: string;
                batchId: string | null;
                quantity: number;
                discount: import("@prisma/client-runtime-utils").Decimal;
                tax: import("@prisma/client-runtime-utils").Decimal;
                total: import("@prisma/client-runtime-utils").Decimal;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            notes: string | null;
            status: import("@prisma/client").$Enums.SaleStatus;
            invoiceNumber: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            remainingAmount: import("@prisma/client-runtime-utils").Decimal;
            customerId: string | null;
            discountReason: string | null;
            insuranceAmount: import("@prisma/client-runtime-utils").Decimal;
        })[];
        saleReturns: {
            id: string;
            createdAt: Date;
            saleId: string;
            reason: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            returnNumber: string;
            customerId: string | null;
            processedById: string;
        }[];
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            category: import("@prisma/client").$Enums.ExpenseCategory;
            description: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            expenseDate: Date;
            createdById: string;
        }[];
        activeProducts: {
            id: string;
            minimumStock: number;
            batches: {
                quantity: number;
                expiryDate: Date;
            }[];
        }[];
        batches: {
            id: string;
            quantity: number;
            expiryDate: Date;
            purchasePrice: import("@prisma/client-runtime-utils").Decimal;
        }[];
        activeCustomersCount: number;
        loyaltyTransactions: {
            type: import("@prisma/client").$Enums.LoyaltyTransactionType;
            points: number;
        }[];
    }>;
}
export declare const dashboardRepository: DashboardRepository;
