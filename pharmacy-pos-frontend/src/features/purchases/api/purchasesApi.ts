import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  Purchase,
  PurchaseQueryParams,
  CreatePurchasePayload,
  ReceivePurchasePayload,
} from '../types/purchase.types.js';

export const purchasesApi = {
  // 1. Get purchases list with filters and pagination
  getPurchases: async (params?: PurchaseQueryParams): Promise<PaginatedResponse<Purchase>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Purchase>>>('/purchases', { params });
    return response.data.data;
  },

  // 2. Get single purchase by ID
  getPurchaseById: async (id: string): Promise<Purchase> => {
    const response = await api.get<ApiResponse<Purchase>>(`/purchases/${id}`);
    return response.data.data;
  },

  // 3. Create purchase invoice
  createPurchase: async (data: CreatePurchasePayload): Promise<Purchase> => {
    const response = await api.post<ApiResponse<Purchase>>('/purchases', data);
    return response.data.data;
  },

  // 4. Update draft purchase invoice
  updatePurchase: async (id: string, data: { notes?: string; discount?: number; tax?: number; paidAmount?: number }): Promise<Purchase> => {
    const response = await api.patch<ApiResponse<Purchase>>(`/purchases/${id}`, data);
    return response.data.data;
  },

  // 5. Receive purchase into inventory (atomic backend execution)
  receivePurchase: async (id: string, data?: ReceivePurchasePayload): Promise<Purchase> => {
    const response = await api.post<ApiResponse<Purchase>>(`/purchases/${id}/receive`, data || {});
    return response.data.data;
  },

  // 6. Cancel purchase
  cancelPurchase: async (id: string, reason?: string): Promise<Purchase> => {
    const response = await api.post<ApiResponse<Purchase>>(`/purchases/${id}/cancel`, { reason });
    return response.data.data;
  },
};
