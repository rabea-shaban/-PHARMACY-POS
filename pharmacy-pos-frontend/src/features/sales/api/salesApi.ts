import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  Sale,
  SaleQueryParams,
  CheckoutRequestPayload,
} from '../types/sale.types.js';

export const salesApi = {
  // 1. Checkout / Create completed sale
  checkout: async (payload: CheckoutRequestPayload): Promise<Sale> => {
    const response = await api.post<ApiResponse<Sale>>('/sales', payload);
    return response.data.data;
  },

  // 2. Get list of sales with filters and pagination
  getSales: async (params?: SaleQueryParams): Promise<PaginatedResponse<Sale>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Sale>>>('/sales', { params });
    return response.data.data;
  },

  // 3. Get single sale by ID
  getSaleById: async (id: string): Promise<Sale> => {
    const response = await api.get<ApiResponse<Sale>>(`/sales/${id}`);
    return response.data.data;
  },

  // 4. Lookup sale by invoice number
  getSaleByInvoice: async (invoiceNumber: string): Promise<Sale> => {
    const response = await api.get<ApiResponse<Sale>>(`/sales/invoice/${invoiceNumber}`);
    return response.data.data;
  },

  // 5. Cancel completed sale
  cancelSale: async (id: string, reason: string): Promise<Sale> => {
    const response = await api.post<ApiResponse<Sale>>(`/sales/${id}/cancel`, { reason });
    return response.data.data;
  },
};
