export interface DashboardOverviewResponse {
  period: {
    from: string;
    to: string;
  };
  sales: {
    grossSales: number;
    totalInvoices: number;
    refundsAmount: number;
    refundsCount: number;
    netSales: number;
    averageInvoiceValue: number;
  };
  expenses: {
    totalExpenses: number;
    expensesCount: number;
  };
  financialSummary: {
    netOperationalRevenue: number;
    estimatedCostOfGoodsSold: number;
    estimatedGrossMargin: number;
    estimatedGrossMarginPercentage: number;
  };
  inventory: {
    totalActiveProducts: number;
    totalStockUnits: number;
    derivableInventoryValue: number;
    lowStockProductsCount: number;
    expiringSoonBatchesCount: number;
    expiredBatchesCount: number;
  };
  customersAndLoyalty: {
    totalActiveCustomers: number;
    pointsEarnedInPeriod: number;
    pointsRedeemedInPeriod: number;
  };
  operationalAlerts: {
    totalAlerts: number;
    lowStockAlerts: number;
    expiryAlerts: number;
  };
}
