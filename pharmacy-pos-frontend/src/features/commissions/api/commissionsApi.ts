import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  CommissionRule,
  CommissionTransaction,
  CommissionSummary,
  CreateCommissionRulePayload,
  UpdateCommissionRulePayload,
  CommissionTransactionQueryParams,
} from '../types/commission.types.js';

export const commissionsApi = {
  // 1. Get commissions aggregate summary
  getSummary: async (params?: { startDate?: string; endDate?: string }): Promise<CommissionSummary> => {
    const response = await api.get<ApiResponse<CommissionSummary>>('/commissions/summary', {
      params,
    });
    return response.data.data;
  },

  // 2. List commission rules
  getRules: async (): Promise<CommissionRule[]> => {
    const response = await api.get<ApiResponse<CommissionRule[]>>('/commissions/rules');
    return response.data.data;
  },

  // 3. Create commission rule
  createRule: async (data: CreateCommissionRulePayload): Promise<CommissionRule> => {
    const response = await api.post<ApiResponse<CommissionRule>>('/commissions/rules', data);
    return response.data.data;
  },

  // 4. Update commission rule
  updateRule: async (id: string, data: UpdateCommissionRulePayload): Promise<CommissionRule> => {
    const response = await api.patch<ApiResponse<CommissionRule>>(`/commissions/rules/${id}`, data);
    return response.data.data;
  },

  // 5. Query commission transactions journal
  getTransactions: async (
    params?: CommissionTransactionQueryParams
  ): Promise<PaginatedResponse<CommissionTransaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CommissionTransaction>>>(
      '/commissions/transactions',
      { params }
    );
    return response.data.data;
  },

  // 6. Get staff member's commission transactions history
  getStaffTransactions: async (
    userId: string,
    params?: CommissionTransactionQueryParams
  ): Promise<PaginatedResponse<CommissionTransaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CommissionTransaction>>>(
      `/commissions/staff/${userId}`,
      { params }
    );
    return response.data.data;
  },
};
