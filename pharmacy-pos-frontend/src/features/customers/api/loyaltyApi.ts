import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { CustomerTier } from '../types/customer.types.js';
import {
  LoyaltySummaryResponse,
  LoyaltyTransactionItem,
  LoyaltyTransactionQueryParams,
  AdjustPointsPayload,
} from '../types/loyalty.types.js';

export const loyaltyApi = {
  // 1. List all available customer tiers
  getTiers: async (): Promise<CustomerTier[]> => {
    const response = await api.get<ApiResponse<CustomerTier[]>>('/loyalty/tiers');
    return response.data.data;
  },

  // 2. Get customer loyalty summary
  getCustomerLoyalty: async (customerId: string): Promise<LoyaltySummaryResponse> => {
    const response = await api.get<ApiResponse<LoyaltySummaryResponse>>(`/customers/${customerId}/loyalty`);
    return response.data.data;
  },

  // 3. Get customer loyalty transactions
  getLoyaltyTransactions: async (
    customerId: string,
    params?: LoyaltyTransactionQueryParams
  ): Promise<PaginatedResponse<LoyaltyTransactionItem>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<LoyaltyTransactionItem>>>(
      `/customers/${customerId}/loyalty/transactions`,
      { params }
    );
    return response.data.data;
  },

  // 4. Adjust customer loyalty points manually (Managers only)
  adjustPoints: async (customerId: string, payload: AdjustPointsPayload): Promise<void> => {
    await api.post<ApiResponse<any>>(`/customers/${customerId}/loyalty/adjust`, payload);
  },
};
