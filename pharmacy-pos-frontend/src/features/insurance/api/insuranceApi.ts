import { api } from '../../../lib/api.js';
import { ApiResponse } from '../../../types/api.types.js';
import {
  InsuranceProvider,
  CustomerInsurance,
  CreateInsuranceProviderDTO,
  UpdateInsuranceProviderDTO,
  CreateCustomerInsuranceDTO,
  InsuranceQueryFilters,
  PaginatedInsuranceProvidersResponse,
} from '../types/insurance.types.js';

export const insuranceApi = {
  // 1. Get List of Insurance Providers (with pagination & filters)
  getProviders: async (
    params?: InsuranceQueryFilters
  ): Promise<PaginatedInsuranceProvidersResponse> => {
    const response = await api.get<ApiResponse<PaginatedInsuranceProvidersResponse>>(
      '/insurance/providers',
      {
        params: {
          ...params,
          isActive:
            params?.isActive !== undefined ? (params.isActive ? 'true' : 'false') : undefined,
        },
      }
    );
    return response.data.data;
  },

  // 2. Get Single Insurance Provider by ID
  getProviderById: async (id: string): Promise<InsuranceProvider> => {
    const response = await api.get<ApiResponse<InsuranceProvider>>(`/insurance/providers/${id}`);
    return response.data.data;
  },

  // 3. Create Insurance Provider (Managers only)
  createProvider: async (data: CreateInsuranceProviderDTO): Promise<InsuranceProvider> => {
    const response = await api.post<ApiResponse<InsuranceProvider>>('/insurance/providers', data);
    return response.data.data;
  },

  // 4. Update Insurance Provider (Managers only)
  updateProvider: async (
    id: string,
    data: UpdateInsuranceProviderDTO
  ): Promise<InsuranceProvider> => {
    const response = await api.patch<ApiResponse<InsuranceProvider>>(
      `/insurance/providers/${id}`,
      data
    );
    return response.data.data;
  },

  // 5. Get Customer Insurance Policies
  getCustomerInsurances: async (customerId: string): Promise<CustomerInsurance[]> => {
    const response = await api.get<ApiResponse<CustomerInsurance[]>>(
      `/insurance/customers/${customerId}`
    );
    return response.data.data;
  },

  // 6. Register / Link Customer Insurance Policy
  createCustomerInsurance: async (
    data: CreateCustomerInsuranceDTO
  ): Promise<CustomerInsurance> => {
    const response = await api.post<ApiResponse<CustomerInsurance>>('/insurance/customers', data);
    return response.data.data;
  },
};
