import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  SaleReturn,
  CreateSaleReturnPayload,
  SaleReturnQueryParams,
} from '../types/return.types.js';

export const returnsApi = {
  // 1. Get list of sale returns with pagination
  getSaleReturns: async (params?: SaleReturnQueryParams): Promise<PaginatedResponse<SaleReturn>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<SaleReturn>>>('/sale-returns', { params });
    return response.data.data;
  },

  // 2. Get single sale return by ID
  getSaleReturnById: async (id: string): Promise<SaleReturn> => {
    const response = await api.get<ApiResponse<SaleReturn>>(`/sale-returns/${id}`);
    return response.data.data;
  },

  // 3. Get returns for a specific sale ID
  getReturnsBySaleId: async (saleId: string): Promise<SaleReturn[]> => {
    const response = await api.get<ApiResponse<SaleReturn[]>>(`/sale-returns/sales/${saleId}`);
    return response.data.data;
  },

  // 4. Create and process sale return
  createSaleReturn: async (payload: CreateSaleReturnPayload): Promise<SaleReturn> => {
    const response = await api.post<ApiResponse<SaleReturn>>('/sale-returns', payload);
    return response.data.data;
  },
};
