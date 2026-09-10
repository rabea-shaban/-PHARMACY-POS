import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  TransferRequest,
  CreateTransferPayload,
  TransferQueryParams,
} from '../types/transfer.types.js';

export const transfersApi = {
  getTransfers: async (params?: TransferQueryParams): Promise<PaginatedResponse<TransferRequest>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<TransferRequest>>>('/transfers', { params });
    return response.data.data;
  },

  getTransferById: async (id: string): Promise<TransferRequest> => {
    const response = await api.get<ApiResponse<TransferRequest>>(`/transfers/${id}`);
    return response.data.data;
  },

  createTransfer: async (data: CreateTransferPayload): Promise<TransferRequest> => {
    const response = await api.post<ApiResponse<TransferRequest>>('/transfers', data);
    return response.data.data;
  },

  approveTransfer: async (id: string): Promise<TransferRequest> => {
    const response = await api.post<ApiResponse<TransferRequest>>(`/transfers/${id}/approve`);
    return response.data.data;
  },

  dispatchTransfer: async (id: string): Promise<TransferRequest> => {
    const response = await api.post<ApiResponse<TransferRequest>>(`/transfers/${id}/dispatch`);
    return response.data.data;
  },

  receiveTransfer: async (id: string): Promise<TransferRequest> => {
    const response = await api.post<ApiResponse<TransferRequest>>(`/transfers/${id}/receive`);
    return response.data.data;
  },

  rejectTransfer: async (id: string, reason: string): Promise<TransferRequest> => {
    const response = await api.post<ApiResponse<TransferRequest>>(`/transfers/${id}/reject`, { reason });
    return response.data.data;
  },

  cancelTransfer: async (id: string): Promise<TransferRequest> => {
    const response = await api.post<ApiResponse<TransferRequest>>(`/transfers/${id}/cancel`);
    return response.data.data;
  },
};
