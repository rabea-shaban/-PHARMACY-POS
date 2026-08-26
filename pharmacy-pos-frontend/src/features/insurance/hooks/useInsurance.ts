import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insuranceApi } from '../api/insuranceApi.js';
import {
  CreateInsuranceProviderDTO,
  UpdateInsuranceProviderDTO,
  CreateCustomerInsuranceDTO,
  InsuranceQueryFilters,
} from '../types/insurance.types.js';

export const INSURANCE_QUERY_KEYS = {
  all: ['insurance'] as const,
  providers: (filters?: InsuranceQueryFilters) =>
    [...INSURANCE_QUERY_KEYS.all, 'providers', filters] as const,
  provider: (id: string) => [...INSURANCE_QUERY_KEYS.all, 'provider', id] as const,
  customerPolicies: (customerId: string) =>
    [...INSURANCE_QUERY_KEYS.all, 'customer', customerId] as const,
};

// 1. Hook: Get List of Insurance Providers
export const useInsuranceProviders = (filters?: InsuranceQueryFilters) => {
  return useQuery({
    queryKey: INSURANCE_QUERY_KEYS.providers(filters),
    queryFn: () => insuranceApi.getProviders(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// 2. Hook: Get Single Insurance Provider
export const useInsuranceProvider = (id: string) => {
  return useQuery({
    queryKey: INSURANCE_QUERY_KEYS.provider(id),
    queryFn: () => insuranceApi.getProviderById(id),
    enabled: Boolean(id),
  });
};

// 3. Hook: Create Insurance Provider
export const useCreateInsuranceProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInsuranceProviderDTO) => insuranceApi.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.all });
    },
  });
};

// 4. Hook: Update Insurance Provider
export const useUpdateInsuranceProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInsuranceProviderDTO }) =>
      insuranceApi.updateProvider(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.provider(id) });
    },
  });
};

// 5. Hook: Get Customer Policies
export const useCustomerInsurances = (customerId: string | undefined | null) => {
  return useQuery({
    queryKey: INSURANCE_QUERY_KEYS.customerPolicies(customerId || ''),
    queryFn: () => (customerId ? insuranceApi.getCustomerInsurances(customerId) : Promise.resolve([])),
    enabled: Boolean(customerId),
  });
};

// 6. Hook: Register / Link Customer Policy
export const useCreateCustomerInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerInsuranceDTO) => insuranceApi.createCustomerInsurance(data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: INSURANCE_QUERY_KEYS.customerPolicies(customerId) });
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customer-insurances', customerId] });
    },
  });
};
