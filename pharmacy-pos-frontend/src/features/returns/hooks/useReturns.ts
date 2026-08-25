import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { returnsApi } from '../api/returnsApi.js';
import { CreateSaleReturnPayload, SaleReturnQueryParams } from '../types/return.types.js';

export function useSaleReturns(params?: SaleReturnQueryParams) {
  return useQuery({
    queryKey: ['sale-returns', params],
    queryFn: () => returnsApi.getSaleReturns(params),
    staleTime: 30 * 1000,
  });
}

export function useSaleReturn(id: string) {
  return useQuery({
    queryKey: ['sale-return', id],
    queryFn: () => returnsApi.getSaleReturnById(id),
    enabled: Boolean(id),
  });
}

export function useReturnsBySale(saleId: string) {
  return useQuery({
    queryKey: ['returns-by-sale', saleId],
    queryFn: () => returnsApi.getReturnsBySaleId(saleId),
    enabled: Boolean(saleId),
  });
}

export function useCreateSaleReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSaleReturnPayload) => returnsApi.createSaleReturn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sale-returns'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale', variables.saleId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
