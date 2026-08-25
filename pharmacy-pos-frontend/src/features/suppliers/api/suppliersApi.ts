import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { Supplier, SupplierQueryParams, SupplierFormValues } from '../types/supplier.types.js';

export const suppliersApi = {
  // 1. Get list of suppliers with search and pagination
  getSuppliers: async (params?: SupplierQueryParams): Promise<PaginatedResponse<Supplier>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Supplier>>>('/suppliers', { params });
    return response.data.data;
  },

  // 2. Get single supplier by ID
  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await api.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data.data;
  },

  // 3. Get supplier purchases history
  getSupplierPurchases: async (id: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<any>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<any>>>(`/suppliers/${id}/purchases`, { params });
    return response.data.data;
  },

  // 4. Create new supplier
  createSupplier: async (data: SupplierFormValues): Promise<Supplier> => {
    const response = await api.post<ApiResponse<Supplier>>('/suppliers', data);
    return response.data.data;
  },

  // 5. Update supplier
  updateSupplier: async (id: string, data: Partial<SupplierFormValues>): Promise<Supplier> => {
    const response = await api.patch<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    return response.data.data;
  },

  // 6. Delete / Deactivate supplier
  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/suppliers/${id}`);
  },
};
