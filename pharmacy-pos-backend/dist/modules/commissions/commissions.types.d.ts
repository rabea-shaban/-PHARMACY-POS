import { PaginationMeta } from '../../types/common.types.js';
export interface CommissionRuleResponse {
    id: string;
    name: string;
    percentage: number;
    fixedAmount: number | null;
    isActive: boolean;
    effectiveDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CommissionTransactionResponse {
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
    createdAt: Date;
}
export interface CreateCommissionRuleInput {
    name: string;
    percentage: number;
    fixedAmount?: number | null;
    effectiveDate?: string | Date;
}
export interface UpdateCommissionRuleInput {
    name?: string;
    percentage?: number;
    fixedAmount?: number | null;
    isActive?: boolean;
    effectiveDate?: string | Date;
}
export interface CommissionTransactionQueryFilters {
    page?: number;
    limit?: number;
    userId?: string;
    saleId?: string;
    commissionRuleId?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    sortBy?: 'commissionAmount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedCommissionTransactionsResponse {
    items: CommissionTransactionResponse[];
    pagination: PaginationMeta;
}
export interface CommissionSummaryResponse {
    totalCommissionsPaid: number;
    totalSalesVolume: number;
    transactionsCount: number;
    staffSummary: {
        userId: string;
        userName: string;
        userRole: string;
        totalCommissions: number;
        salesCount: number;
    }[];
}
