import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/paymentsApi.js';
import { PaymentQueryParams } from '../types/payment.types.js';

export function usePayments(params?: PaymentQueryParams) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsApi.getPayments(params),
    staleTime: 30 * 1000,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentsApi.getPaymentById(id),
    enabled: Boolean(id),
  });
}

export function useSalePayments(saleId: string) {
  return useQuery({
    queryKey: ['sales', saleId, 'payments'],
    queryFn: () => paymentsApi.getPaymentsBySaleId(saleId),
    enabled: Boolean(saleId),
  });
}
