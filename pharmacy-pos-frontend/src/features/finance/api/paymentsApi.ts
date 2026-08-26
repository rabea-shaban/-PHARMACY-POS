import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { PaymentRecord, PaymentQueryParams } from '../types/payment.types.js';

export const paymentsApi = {
  // 1. Get list of payments with pagination & filters
  getPayments: async (params?: PaymentQueryParams): Promise<PaginatedResponse<PaymentRecord>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<PaymentRecord>>>('/payments', {
      params,
    });
    return response.data.data;
  },

  // 2. Get payment details by ID
  getPaymentById: async (id: string): Promise<PaymentRecord> => {
    const response = await api.get<ApiResponse<PaymentRecord>>(`/payments/${id}`);
    return response.data.data;
  },

  // 3. Get all payments for a specific sale
  getPaymentsBySaleId: async (saleId: string): Promise<PaymentRecord[]> => {
    const response = await api.get<ApiResponse<PaymentRecord[]>>(`/payments/sales/${saleId}`);
    return response.data.data;
  },
};
