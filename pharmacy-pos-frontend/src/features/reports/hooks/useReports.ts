import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reportsApi.js';
import {
  SalesReportQueryFilters,
  ProductReportQueryFilters,
  InventoryReportQueryFilters,
  PurchaseReportQueryFilters,
  ExpenseReportQueryFilters,
  CustomerReportQueryFilters,
  StaffReportQueryFilters,
  FinancialSummaryQueryFilters,
} from '../types/report.types.js';

export function useSalesReport(params?: SalesReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'sales', params],
    queryFn: () => reportsApi.getSalesReport(params),
    staleTime: 30 * 1000,
  });
}

export function useProductReport(params?: ProductReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'products', params],
    queryFn: () => reportsApi.getProductReport(params),
    staleTime: 30 * 1000,
  });
}

export function useInventoryReport(params?: InventoryReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'inventory', params],
    queryFn: () => reportsApi.getInventoryReport(params),
    staleTime: 30 * 1000,
  });
}

export function usePurchaseReport(params?: PurchaseReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'purchases', params],
    queryFn: () => reportsApi.getPurchaseReport(params),
    staleTime: 30 * 1000,
  });
}

export function useExpenseReport(params?: ExpenseReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'expenses', params],
    queryFn: () => reportsApi.getExpenseReport(params),
    staleTime: 30 * 1000,
  });
}

export function useCustomerReport(params?: CustomerReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'customers', params],
    queryFn: () => reportsApi.getCustomerReport(params),
    staleTime: 30 * 1000,
  });
}

export function useStaffReport(params?: StaffReportQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'staff', params],
    queryFn: () => reportsApi.getStaffReport(params),
    staleTime: 30 * 1000,
  });
}

export function useFinancialSummary(params?: FinancialSummaryQueryFilters) {
  return useQuery({
    queryKey: ['reports', 'financial-summary', params],
    queryFn: () => reportsApi.getFinancialSummary(params),
    staleTime: 30 * 1000,
  });
}
