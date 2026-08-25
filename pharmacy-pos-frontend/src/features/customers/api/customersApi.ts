import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { Customer, CustomerQueryParams, CreateCustomerPayload, CustomerInsurancePolicy } from '../types/customer.types.js';

export const customersApi = {
  // 1. Get list of customers
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

  // 3. Get single customer by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data;
  },

  // 4. Quick customer registration from POS
  createCustomer: async (data: CreateCustomerPayload): Promise<Customer> => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data.data;
  },

  // 5. Get customer insurance policies
  getCustomerInsurances: async (customerId: string): Promise<CustomerInsurancePolicy[]> => {
    const response = await api.get<ApiResponse<CustomerInsurancePolicy[]>>(`/insurance/customers/${customerId}`);
    return response.data.data;
  },
};
