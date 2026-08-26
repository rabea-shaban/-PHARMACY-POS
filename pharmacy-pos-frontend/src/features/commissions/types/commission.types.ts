export interface CommissionRule {
  id: string;
  name: string;
  percentage: number;
  fixedAmount: number | null;
  isActive: boolean;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionTransaction {
  id: string;
  userId: string;
  userName?: string;
  userRole?: string;
  saleId: string | null;
  invoiceNumber?: string | null;
  commissionRuleId: string | null;
  commissionRuleName?: string | null;
  salesAmount: number;
  commissionAmount: number;
  commissionRate: number;
  createdAt: string;
}

export interface CreateCommissionRulePayload {
  name: string;
  percentage: number;
  fixedAmount?: number | null;
  effectiveDate?: string;
}

export interface UpdateCommissionRulePayload {
  name?: string;
  percentage?: number;
  fixedAmount?: number | null;
  isActive?: boolean;
  effectiveDate?: string;
}

export interface CommissionTransactionQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  saleId?: string;
  commissionRuleId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'commissionAmount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface StaffCommissionSummaryItem {
  userId: string;
  userName: string;
  userRole: string;
  totalCommissions: number;
  salesCount: number;
}

export interface CommissionSummary {
  totalCommissionsPaid: number;
  totalSalesVolume: number;
  transactionsCount: number;
  staffSummary: StaffCommissionSummaryItem[];
}
