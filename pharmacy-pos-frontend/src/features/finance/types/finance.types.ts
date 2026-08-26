export interface DatePeriod {
  from: string;
  to: string;
}

export interface FinancialMetrics {
  grossSales: number;
  returnsAndRefunds: number;
  netSales: number;
  receivedPurchasesCost: number;
  operatingExpenses: number;
  netStaffCommissions: number;
  netOperationalMovement: number;
}

export interface FinancialVolumeBreakdown {
  salesVolume: number;
  returnsVolume: number;
  purchasesVolume: number;
  expensesVolume: number;
  commissionsVolume: number;
}

export interface FinancialSummaryResponse {
  period: DatePeriod;
  metrics: FinancialMetrics;
  breakdown: FinancialVolumeBreakdown;
}

export interface FinancialSummaryQueryParams {
  from?: string;
  to?: string;
}
