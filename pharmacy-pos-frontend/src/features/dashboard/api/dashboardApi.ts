import { api } from '../../../lib/api.js';
import { ApiResponse } from '../../../types/api.types.js';
import {
  DashboardKPIs,
  SalesTrendItem,
  RecentSaleItem,
  LowStockProduct,
  ExpiringBatch,
  TimeRangeOption,
} from '../types/dashboard.types.js';

function getDateRange(range: TimeRangeOption): { from?: string; to?: string } {
  const now = new Date();
  const to = now.toISOString().slice(0, 10);

  if (range === 'today') {
    return { from: to, to };
  } else if (range === '7days') {
    const fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { from: fromDate.toISOString().slice(0, 10), to };
  } else {
    const fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: fromDate.toISOString().slice(0, 10), to };
  }
}

export const dashboardApi = {
  // 1. Fetch Sales KPI & Trend data
  getSalesOverview: async (range: TimeRangeOption = '7days'): Promise<{
    summary: any;
    dailyTrend: SalesTrendItem[];
    topSellingProducts: any[];
  }> => {
    const { from, to } = getDateRange(range);
    const response = await api.get<ApiResponse<any>>('/reports/sales', {
      params: { from, to, limit: 10 },
    });
    return {
      summary: response.data.data.summary,
      dailyTrend: response.data.data.dailyTrend || [],
      topSellingProducts: response.data.data.topSellingProducts || [],
    };
  },

  // 2. Fetch Inventory Health & Low Stock
  getInventorySummary: async (): Promise<{
    summary: any;
    health: any;
    lowStockItems: LowStockProduct[];
  }> => {
    const response = await api.get<ApiResponse<any>>('/reports/inventory');
    return {
      summary: response.data.data.summary,
      health: response.data.data.health,
      lowStockItems: response.data.data.lowStockItems || [],
    };
  },

  // 3. Fetch Expiring Batches (FEFO within 30 days)
  getExpiringBatches: async (days = 30): Promise<ExpiringBatch[]> => {
    const response = await api.get<ApiResponse<any>>('/batches/expiring', {
      params: { days },
    });
    const items = Array.isArray(response.data.data) ? response.data.data : response.data.data.batches || [];
    return items.map((b: any) => {
      const exp = new Date(b.expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: b.id,
        batchNumber: b.batchNumber,
        productId: b.productId,
        productName: b.product?.name || b.productName || 'دواء',
        barcode: b.product?.barcode || b.barcode || '',
        currentQuantity: b.currentQuantity || b.quantity || 0,
        expiryDate: b.expiryDate,
        daysRemaining: diffDays > 0 ? diffDays : 0,
      };
    });
  },

  // 4. Fetch Recent Sales Transactions
  getRecentSales: async (limit = 5): Promise<RecentSaleItem[]> => {
    const response = await api.get<ApiResponse<any>>('/sales', {
      params: { limit, page: 1 },
    });
    const items = response.data.data.items || response.data.data || [];
    return items.map((s: any) => ({
      id: s.id,
      invoiceNumber: s.invoiceNumber,
      date: s.createdAt,
      cashierName: s.user?.name || s.cashierName || 'كاشير',
      customerName: s.customer?.name || s.customerName || null,
      status: s.status,
      paymentMethod: s.paymentMethod,
      total: Number(s.total),
      itemsCount: s.items?.length || 0,
    }));
  },

  // 5. Aggregate KPIs for Dashboard
  getKPIs: async (): Promise<DashboardKPIs> => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const [salesRes, invRes] = await Promise.all([
      api.get<ApiResponse<any>>('/reports/sales', { params: { from: todayStr, to: todayStr } }),
      api.get<ApiResponse<any>>('/reports/inventory'),
    ]);

    const salesSummary = salesRes.data.data.summary;
    const invHealth = invRes.data.data.health;

    return {
      todaySales: salesSummary.invoiceCount || 0,
      todayRevenue: salesSummary.totalGrossSales || 0,
      todayProfit: salesSummary.netSales || 0,
      invoiceCount: salesSummary.invoiceCount || 0,
      averageInvoiceValue: salesSummary.averageInvoiceValue || 0,
      lowStockCount: invHealth.lowStockProductsCount || 0,
      expiringSoonCount: invHealth.expiringSoonStockUnits || 0,
      healthyStockUnits: invHealth.healthyStockUnits || 0,
    };
  },
};
