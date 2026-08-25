import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi.js';
import { StockAdjustmentPayload } from '../types/inventory.types.js';

export function useInventorySummary() {
  return useQuery({
    queryKey: ['inventory', 'summary'],
    queryFn: () => inventoryApi.getInventorySummary(),
    staleTime: 60 * 1000,
  });
}

export function useBatches(params?: { page?: number; limit?: number; search?: string; productId?: string }) {
  return useQuery({
    queryKey: ['inventory', 'batches', params],
    queryFn: () => inventoryApi.getBatches(params),
    staleTime: 60 * 1000,
  });
}

export function useExpiringBatches(days = 30) {
  return useQuery({
    queryKey: ['inventory', 'expiring', days],
    queryFn: () => inventoryApi.getExpiringBatches(days),
    staleTime: 60 * 1000,
  });
}

export function useExpiredBatches() {
  return useQuery({
    queryKey: ['inventory', 'expired'],
    queryFn: () => inventoryApi.getExpiredBatches(),
    staleTime: 60 * 1000,
  });
}

export function useInventoryTransactions(params?: {
  page?: number;
  limit?: number;
  productId?: string;
  batchId?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: ['inventory', 'transactions', params],
    queryFn: () => inventoryApi.getTransactions(params),
    staleTime: 30 * 1000,
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StockAdjustmentPayload) => inventoryApi.adjustStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
