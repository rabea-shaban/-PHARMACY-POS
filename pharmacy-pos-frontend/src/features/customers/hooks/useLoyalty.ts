import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loyaltyApi } from '../api/loyaltyApi.js';
import { LoyaltyTransactionQueryParams, AdjustPointsPayload } from '../types/loyalty.types.js';

export function useCustomerTiers() {
  return useQuery({
    queryKey: ['loyalty-tiers'],
    queryFn: () => loyaltyApi.getTiers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomerLoyalty(customerId: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'loyalty'],
    queryFn: () => loyaltyApi.getCustomerLoyalty(customerId),
    enabled: Boolean(customerId),
  });
}

export function useLoyaltyTransactions(customerId: string, params?: LoyaltyTransactionQueryParams) {
  return useQuery({
    queryKey: ['customers', customerId, 'loyalty-transactions', params],
    queryFn: () => loyaltyApi.getLoyaltyTransactions(customerId, params),
    enabled: Boolean(customerId),
  });
}

export function useAdjustLoyaltyPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, payload }: { customerId: string; payload: AdjustPointsPayload }) =>
      loyaltyApi.adjustPoints(customerId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers', variables.customerId, 'loyalty'] });
      queryClient.invalidateQueries({
        queryKey: ['customers', variables.customerId, 'loyalty-transactions'],
      });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
