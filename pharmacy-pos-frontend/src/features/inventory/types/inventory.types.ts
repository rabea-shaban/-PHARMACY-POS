export type InventoryTransactionType =
  | 'PURCHASE'
  | 'SALE'
  | 'SALE_RETURN'
  | 'PURCHASE_RETURN'
  | 'ADJUSTMENT'
  | 'DAMAGE'
  | 'EXPIRED'
  | 'MANUAL_IN'
  | 'MANUAL_OUT';

export interface BatchItem {
  id: string;
  batchNumber: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    barcode: string;
    sellingPrice: number;
    purchasePrice: number;
  };
  productName?: string;
  barcode?: string;
  quantity: number;
  initialQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    barcode: string;
  };
  batchId?: string | null;
  batch?: {
    id: string;
    batchNumber: string;
  } | null;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
  type: InventoryTransactionType;
  quantity: number;
  reason: string;
  referenceType?: string | null;
  referenceId?: string | null;
  createdAt: string;
}

export interface StockAdjustmentPayload {
  productId: string;
  batchId: string;
  quantity: number;
  type: InventoryTransactionType;
  reason: string;
  referenceType?: string | null;
  referenceId?: string | null;
}

export interface InventoryHealthSummary {
  totalProducts: number;
  totalActiveBatches: number;
  totalStockUnits: number;
  derivableInventoryCostValue: number;
  derivableInventoryRetailValue: number;
  healthyStockUnits: number;
  expiringSoonStockUnits: number;
  expiredStockUnits: number;
  lowStockProductsCount: number;
}
