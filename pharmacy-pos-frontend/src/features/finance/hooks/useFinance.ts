import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../api/financeApi.js';
import { FinancialSummaryQueryParams } from '../types/finance.types.js';

export function useFinancialSummary(params?: FinancialSummaryQueryParams) {
  return useQuery({
    queryKey: ['finance', 'summary', params],
    queryFn: () => financeApi.getFinancialSummary(params),
    staleTime: 60 * 1000,
  });
}
