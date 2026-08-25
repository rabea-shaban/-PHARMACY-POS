import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../api/customersApi.js';
import {
  CustomerQueryParams,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CustomerPurchasesQueryParams,
} from '../types/customer.types.js';

export function useCustomers(params?: CustomerQueryParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.getCustomers(params),
    staleTime: 30 * 1000,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.getCustomerById(id),
    enabled: Boolean(id),
  });
}

export function useCustomerPurchases(id: string, params?: CustomerPurchasesQueryParams) {
  return useQuery({
    queryKey: ['customers', id, 'purchases', params],
    queryFn: () => customersApi.getCustomerPurchases(id, params),
    enabled: Boolean(id),
  });
}

export function useCustomerInsurances(customerId: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'insurances'],
    queryFn: () => customersApi.getCustomerInsurances(customerId),
    enabled: Boolean(customerId),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerPayload) => customersApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerPayload }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
}

export function useDeactivateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersApi.deleteCustomer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', id] });
    },
  });
}
