import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { Discount } from '../types/discount.types.js';

export const discountsApi = {
  getDiscounts: async (params?: { search?: string; code?: string; isActive?: boolean }): Promise<PaginatedResponse<Discount>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Discount>>>('/discounts', { params });
    return response.data.data;
  },
};
