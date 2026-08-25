import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi.js';
import { TimeRangeOption } from '../types/dashboard.types.js';

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => dashboardApi.getKPIs(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // auto refetch every 2 mins
  });
}

export function useSalesOverview(range: TimeRangeOption = '7days') {
  return useQuery({
    queryKey: ['dashboard', 'sales-overview', range],
    queryFn: () => dashboardApi.getSalesOverview(range),
    staleTime: 60 * 1000,
  });
}

export function useRecentSales() {
  return useQuery({
    queryKey: ['dashboard', 'recent-sales'],
    queryFn: () => dashboardApi.getRecentSales(5),
    staleTime: 30 * 1000,
  });
}

export function useLowStockItems() {
  return useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: async () => {
      const data = await dashboardApi.getInventorySummary();
      return data.lowStockItems;
    },
    staleTime: 60 * 1000,
  });
}

export function useExpiringBatches() {
  return useQuery({
    queryKey: ['dashboard', 'expiring-batches'],
    queryFn: () => dashboardApi.getExpiringBatches(30),
    staleTime: 60 * 1000,
  });
}
