export interface DashboardKPIs {
  todaySales: number;
  todayRevenue: number;
  todayProfit: number;
  invoiceCount: number;
  averageInvoiceValue: number;
  lowStockCount: number;
  expiringSoonCount: number;
  healthyStockUnits: number;
}

export interface SalesTrendItem {
  date: string;
  salesCount: number;
  grossAmount: number;
}

export interface RecentSaleItem {
  id: string;
  invoiceNumber: string;
  date: string;
  cashierName: string;
  customerName: string | null;
  status: string;
  paymentMethod: string;
  total: number;
  itemsCount: number;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  barcode: string;
  categoryName: string;
  currentStock: number;
  minimumStock: number;
}

export interface ExpiringBatch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  barcode: string;
  currentQuantity: number;
  expiryDate: string;
  daysRemaining: number;
}

export type TimeRangeOption = 'today' | '7days' | '30days';
