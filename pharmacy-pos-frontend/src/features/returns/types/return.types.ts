export interface ReturnItemPayload {
  saleItemId: string;
  quantity: number;
}

export interface CreateSaleReturnPayload {
  saleId: string;
  reason?: string | null;
  items: ReturnItemPayload[];
}

export interface SaleReturnItem {
  id: string;
  saleItemId: string;
  productId: string;
  productName: string;
  barcode: string;
  batchId?: string | null;
  batchNumber?: string | null;
  quantity: number;
  refundAmount: number;
}

export interface SaleReturn {
  id: string;
  returnNumber: string;
  saleId: string;
  invoiceNumber: string;
  customerId?: string | null;
  customerName?: string | null;
  processedById: string;
  processedByName: string;
  reason?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  items: SaleReturnItem[];
}

export interface SaleReturnQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  returnNumber?: string;
  saleId?: string;
  customerId?: string;
  processedById?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'returnNumber' | 'total' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
