import { PaymentMethod, ExpenseCategory, PurchaseStatus } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';
export interface DatePeriod {
    from: string;
    to: string;
}
export interface SalesReportQueryFilters {
    from?: string;
    to?: string;
    userId?: string;
    customerId?: string;
    paymentMethod?: PaymentMethod;
    productId?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
}
export interface SalesReportResponse {
    period: DatePeriod;
    summary: {
        totalGrossSales: number;
        invoiceCount: number;
        returnedAmount: number;
        netSales: number;
        averageInvoiceValue: number;
        totalItemsSold: number;
    };
    paymentMethodBreakdown: {
        paymentMethod: PaymentMethod;
        amount: number;
        count: number;
    }[];
    topSellingProducts: {
        productId: string;
        productName: string;
        barcode: string | null;
        quantitySold: number;
        revenue: number;
    }[];
    topSellingCategories: {
        categoryId: string;
        categoryName: string;
        quantitySold: number;
        revenue: number;
    }[];
    dailyTrend: {
        date: string;
        salesCount: number;
        grossAmount: number;
    }[];
    invoices: {
        id: string;
        invoiceNumber: string;
        date: Date;
        cashierName: string;
        customerName: string | null;
        status: string;
        total: number;
        itemsCount: number;
    }[];
    pagination: PaginationMeta;
}
export interface ProductReportQueryFilters {
    from?: string;
    to?: string;
    categoryId?: string;
    productId?: string;
    page?: number;
    limit?: number;
}
export interface ProductPerformanceItem {
    productId: string;
    name: string;
    barcode: string | null;
    categoryName: string;
    purchasePrice: number;
    sellingPrice: number;
    currentStock: number;
    quantitySold: number;
    revenueGenerated: number;
    returnQuantity: number;
    returnAmount: number;
    netQuantity: number;
    netRevenue: number;
}
export interface ProductReportResponse {
    period: DatePeriod;
    thresholds: {
        slowMovingThreshold: number;
    };
    summary: {
        totalProductsEvaluated: number;
        totalUnitsSold: number;
        totalRevenueGenerated: number;
        slowMovingCount: number;
        zeroSalesCount: number;
    };
    topSellingProducts: ProductPerformanceItem[];
    slowMovingProducts: ProductPerformanceItem[];
    zeroSalesProducts: ProductPerformanceItem[];
    allProducts: ProductPerformanceItem[];
    pagination: PaginationMeta;
}
export interface InventoryReportQueryFilters {
    from?: string;
    to?: string;
    categoryId?: string;
}
export interface InventoryReportResponse {
    period: DatePeriod;
    summary: {
        totalProducts: number;
        totalActiveBatches: number;
        totalStockUnits: number;
        derivableInventoryCostValue: number;
        derivableInventoryRetailValue: number;
    };
    health: {
        healthyStockUnits: number;
        expiringSoonStockUnits: number;
        expiredStockUnits: number;
        lowStockProductsCount: number;
    };
    lowStockItems: {
        productId: string;
        productName: string;
        barcode: string | null;
        categoryName: string;
        currentStock: number;
        minimumStock: number;
    }[];
    stockMovementsSummary: {
        type: string;
        totalQuantity: number;
        transactionCount: number;
    }[];
}
export interface PurchaseReportQueryFilters {
    from?: string;
    to?: string;
    supplierId?: string;
    status?: PurchaseStatus;
}
export interface PurchaseReportResponse {
    period: DatePeriod;
    summary: {
        totalInvoices: number;
        receivedInvoices: number;
        pendingInvoices: number;
        cancelledInvoices: number;
        totalPurchaseValue: number;
        totalAmountPaid: number;
        totalAmountRemaining: number;
    };
    supplierSpendingBreakdown: {
        supplierId: string;
        supplierName: string;
        supplierPhone: string;
        invoiceCount: number;
        totalSpent: number;
    }[];
    monthlyTrend: {
        month: string;
        invoiceCount: number;
        totalAmount: number;
    }[];
}
export interface ExpenseReportQueryFilters {
    from?: string;
    to?: string;
    category?: ExpenseCategory;
    paymentMethod?: PaymentMethod;
}
export interface ExpenseReportResponse {
    period: DatePeriod;
    summary: {
        totalExpenses: number;
        expensesCount: number;
        averageExpenseAmount: number;
    };
    categoryBreakdown: {
        category: ExpenseCategory;
        amount: number;
        count: number;
        percentage: number;
    }[];
    paymentMethodBreakdown: {
        paymentMethod: PaymentMethod;
        amount: number;
        count: number;
    }[];
    dailyTrend: {
        date: string;
        amount: number;
        count: number;
    }[];
}
export interface CustomerReportQueryFilters {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}
export interface CustomerReportResponse {
    period: DatePeriod;
    summary: {
        totalCustomers: number;
        activeCustomers: number;
        newCustomersInPeriod: number;
        purchasingCustomersInPeriod: number;
        averageCustomerSpend: number;
    };
    loyaltySummary: {
        totalPointsEarned: number;
        totalPointsRedeemed: number;
        tierDistribution: {
            tierName: string;
            customerCount: number;
        }[];
    };
    topCustomersByRevenue: {
        customerId: string;
        name: string;
        phone: string;
        tierName: string;
        invoicesCount: number;
        totalSpend: number;
        currentLoyaltyPoints: number;
    }[];
    pagination: PaginationMeta;
}
export interface StaffReportQueryFilters {
    from?: string;
    to?: string;
    userId?: string;
}
export interface StaffPerformanceItem {
    userId: string;
    name: string;
    role: string;
    invoicesCount: number;
    totalSalesAmount: number;
    commissionEarned: number;
    commissionReversed: number;
    netCommission: number;
}
export interface StaffReportResponse {
    period: DatePeriod;
    summary: {
        totalStaffEvaluated: number;
        totalSalesHandled: number;
        totalCommissionDistributed: number;
    };
    staffPerformance: StaffPerformanceItem[];
}
export interface FinancialSummaryResponse {
    period: DatePeriod;
    metrics: {
        grossSales: number;
        returnsAndRefunds: number;
        netSales: number;
        receivedPurchasesCost: number;
        operatingExpenses: number;
        netStaffCommissions: number;
        netOperationalMovement: number;
    };
    breakdown: {
        salesVolume: number;
        returnsVolume: number;
        purchasesVolume: number;
        expensesVolume: number;
        commissionsVolume: number;
    };
}
