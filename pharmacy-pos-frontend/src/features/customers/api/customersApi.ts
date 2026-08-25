import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  Customer,
  CustomerQueryParams,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CustomerInsurancePolicy,
  CustomerPurchaseItem,
  CustomerPurchasesQueryParams,
} from '../types/customer.types.js';

export const customersApi = {
  // 1. Get list of customers with filters and pagination
  getCustomers: async (params?: CustomerQueryParams): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Customer>>>('/customers', { params });
    return response.data.data;
  },

  // 2. Search customers quickly by name or phone for POS
  searchCustomers: async (query: string): Promise<Customer[]> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Customer>>>('/customers', {
      params: { search: query, limit: 10, isActive: true },
    });
    return response.data.data.items;
  },

  // 3. Get single customer profile by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data;
  },

  // 4. Get customer purchases history
  getCustomerPurchases: async (
    id: string,
    params?: CustomerPurchasesQueryParams
  ): Promise<PaginatedResponse<CustomerPurchaseItem>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CustomerPurchaseItem>>>(
      `/customers/${id}/purchases`,
      { params }
    );
    return response.data.data;
  },

  // 5. Register new customer
  createCustomer: async (data: CreateCustomerPayload): Promise<Customer> => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data.data;
  },

  // 6. Update customer profile
  updateCustomer: async (id: string, data: UpdateCustomerPayload): Promise<Customer> => {
    const response = await api.patch<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data.data;
  },

  // 7. Soft delete / deactivate customer
  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/customers/${id}`);
  },

  // 8. Get customer insurance policies
  getCustomerInsurances: async (customerId: string): Promise<CustomerInsurancePolicy[]> => {
    const response = await api.get<ApiResponse<CustomerInsurancePolicy[]>>(`/insurance/customers/${customerId}`);
    return response.data.data;
  },
};
