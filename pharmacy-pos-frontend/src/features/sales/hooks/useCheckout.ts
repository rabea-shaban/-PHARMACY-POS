import { useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/salesApi.js';
import { CheckoutRequestPayload } from '../types/sale.types.js';

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutRequestPayload) => salesApi.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
