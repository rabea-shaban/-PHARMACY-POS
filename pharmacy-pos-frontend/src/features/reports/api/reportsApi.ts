import { api } from '../../../lib/api.js';
import { ApiResponse } from '../../../types/api.types.js';
import {
  SalesReportQueryFilters,
  SalesReportResponse,
  ProductReportQueryFilters,
  ProductReportResponse,
  InventoryReportQueryFilters,
  InventoryReportResponse,
  PurchaseReportQueryFilters,
  PurchaseReportResponse,
  ExpenseReportQueryFilters,
  ExpenseReportResponse,
  CustomerReportQueryFilters,
  CustomerReportResponse,
  StaffReportQueryFilters,
  StaffReportResponse,
  FinancialSummaryQueryFilters,
  FinancialSummaryResponse,
} from '../types/report.types.js';

export const reportsApi = {
  // 1. Sales Report
  getSalesReport: async (params?: SalesReportQueryFilters): Promise<SalesReportResponse> => {
    const response = await api.get<ApiResponse<SalesReportResponse>>('/reports/sales', { params });
    return response.data.data;
  },

  // 2. Product Performance Report
  getProductReport: async (params?: ProductReportQueryFilters): Promise<ProductReportResponse> => {
    const response = await api.get<ApiResponse<ProductReportResponse>>('/reports/products', { params });
    return response.data.data;
  },

  // 3. Inventory Health & Valuation Report
  getInventoryReport: async (params?: InventoryReportQueryFilters): Promise<InventoryReportResponse> => {
    const response = await api.get<ApiResponse<InventoryReportResponse>>('/reports/inventory', { params });
    return response.data.data;
  },

  // 4. Purchases & Procurement Report
  getPurchaseReport: async (params?: PurchaseReportQueryFilters): Promise<PurchaseReportResponse> => {
    const response = await api.get<ApiResponse<PurchaseReportResponse>>('/reports/purchases', { params });
    return response.data.data;
  },

  // 5. Operating Expenses Report
  getExpenseReport: async (params?: ExpenseReportQueryFilters): Promise<ExpenseReportResponse> => {
    const response = await api.get<ApiResponse<ExpenseReportResponse>>('/reports/expenses', { params });
    return response.data.data;
  },

  // 6. Customer & Loyalty Report
  getCustomerReport: async (params?: CustomerReportQueryFilters): Promise<CustomerReportResponse> => {
    const response = await api.get<ApiResponse<CustomerReportResponse>>('/reports/customers', { params });
    return response.data.data;
  },

  // 7. Staff Performance & Commissions Report
  getStaffReport: async (params?: StaffReportQueryFilters): Promise<StaffReportResponse> => {
    const response = await api.get<ApiResponse<StaffReportResponse>>('/reports/staff', { params });
    return response.data.data;
  },

  // 8. Executive Financial Summary Report
  getFinancialSummary: async (
    params?: FinancialSummaryQueryFilters
  ): Promise<FinancialSummaryResponse> => {
    const response = await api.get<ApiResponse<FinancialSummaryResponse>>(
      '/reports/financial-summary',
      { params }
    );
    return response.data.data;
  },
};
