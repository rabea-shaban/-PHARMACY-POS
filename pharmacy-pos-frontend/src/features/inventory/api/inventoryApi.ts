import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  BatchItem,
  InventoryTransaction,
  StockAdjustmentPayload,
} from '../types/inventory.types.js';
import { LowStockProduct, ExpiringBatch } from '../../dashboard/types/dashboard.types.js';

export const inventoryApi = {
  // 1. Get Inventory Health Summary & Low stock from reports
  getInventorySummary: async (): Promise<{
    summary: any;
    health: any;
    lowStockItems: LowStockProduct[];
  }> => {
    const response = await api.get<ApiResponse<any>>('/reports/inventory');
    return response.data.data;
  },

  // 2. Get Batches list
  getBatches: async (params?: { page?: number; limit?: number; search?: string; productId?: string }): Promise<PaginatedResponse<BatchItem>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<BatchItem>>>('/batches', { params });
    return response.data.data;
  },

  // 3. Get Expiring Batches (within specified days)
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

  // 4. Get Expired Batches
  getExpiredBatches: async (): Promise<BatchItem[]> => {
    const response = await api.get<ApiResponse<BatchItem[]>>('/batches/expired');
    return response.data.data;
  },

  // 5. Get Inventory Transactions Ledger (Audit-style)
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    productId?: string;
    batchId?: string;
    type?: string;
  }): Promise<PaginatedResponse<InventoryTransaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<InventoryTransaction>>>('/inventory/transactions', {
      params,
    });
    return response.data.data;
  },

  // 6. Submit Stock Adjustment (Managers only)
  adjustStock: async (data: StockAdjustmentPayload): Promise<void> => {
    await api.post<ApiResponse<any>>('/inventory/adjustments', data);
  },

  // 7. Create Batch
  createBatch: async (data: {
    productId: string;
    batchNumber: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    expiryDate: string;
  }): Promise<BatchItem> => {
    const response = await api.post<ApiResponse<BatchItem>>('/batches', data);
    return response.data.data;
  },
};
