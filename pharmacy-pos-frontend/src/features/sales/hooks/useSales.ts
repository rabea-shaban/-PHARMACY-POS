import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/salesApi.js';
import { SaleQueryParams } from '../types/sale.types.js';

export function useSales(params?: SaleQueryParams) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => salesApi.getSales(params),
    staleTime: 30 * 1000,
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: () => salesApi.getSaleById(id),
    enabled: Boolean(id),
  });
}

export function useSaleByInvoice(invoiceNumber: string) {
  return useQuery({
    queryKey: ['sale-invoice', invoiceNumber],
    queryFn: () => salesApi.getSaleByInvoice(invoiceNumber),
    enabled: Boolean(invoiceNumber),
  });
}

export function useCancelSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      salesApi.cancelSale(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
