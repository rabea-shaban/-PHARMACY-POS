import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../../customers/api/customersApi.js';
import { CreateCustomerPayload } from '../../customers/types/customer.types.js';

export function useCustomerSearch(query: string) {
  return useQuery({
    queryKey: ['customers-search', query],
    queryFn: () => customersApi.searchCustomers(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useCustomerInsurances(customerId: string | undefined | null) {
  return useQuery({
    queryKey: ['customer-insurances', customerId],
    queryFn: () => (customerId ? customersApi.getCustomerInsurances(customerId) : Promise.resolve([])),
    enabled: Boolean(customerId),
  });
}

export function useCreateCustomerQuick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerPayload) => customersApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers-search'] });
    },
  });
}
