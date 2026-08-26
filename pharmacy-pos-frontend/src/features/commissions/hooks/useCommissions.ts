import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionsApi } from '../api/commissionsApi.js';
import {
  CommissionTransactionQueryParams,
  CreateCommissionRulePayload,
  UpdateCommissionRulePayload,
} from '../types/commission.types.js';

export function useCommissionSummary(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['commissions', 'summary', params],
    queryFn: () => commissionsApi.getSummary(params),
    staleTime: 30 * 1000,
  });
}

export function useCommissionRules() {
  return useQuery({
    queryKey: ['commissions', 'rules'],
    queryFn: () => commissionsApi.getRules(),
    staleTime: 60 * 1000,
  });
}

export function useCommissionTransactions(params?: CommissionTransactionQueryParams) {
  return useQuery({
    queryKey: ['commissions', 'transactions', params],
    queryFn: () => commissionsApi.getTransactions(params),
    staleTime: 20 * 1000,
  });
}

export function useStaffCommissionTransactions(
  userId: string,
  params?: CommissionTransactionQueryParams
) {
  return useQuery({
    queryKey: ['commissions', 'staff', userId, params],
    queryFn: () => commissionsApi.getStaffTransactions(userId, params),
    enabled: Boolean(userId),
    staleTime: 20 * 1000,
  });
}

export function useCreateCommissionRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommissionRulePayload) => commissionsApi.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions', 'rules'] });
      queryClient.invalidateQueries({ queryKey: ['commissions', 'summary'] });
    },
  });
}

export function useUpdateCommissionRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommissionRulePayload }) =>
      commissionsApi.updateRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions', 'rules'] });
      queryClient.invalidateQueries({ queryKey: ['commissions', 'summary'] });
    },
  });
}
