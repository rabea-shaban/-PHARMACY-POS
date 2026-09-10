export type InventoryTransactionType =
  | 'PURCHASE'
  | 'SALE'
  | 'SALE_RETURN'
  | 'PURCHASE_RETURN'
  | 'ADJUSTMENT'
  | 'DAMAGE'
  | 'EXPIRED'
  | 'MANUAL_IN'
  | 'MANUAL_OUT'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN';

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
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    code: string;
  } | null;
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
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    code: string;
  } | null;
  createdById?: string | null;
  createdBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
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
  branchId?: string;
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

export interface MatrixBranchStock {
  branchId: string;
  branchName: string;
  branchCode: string;
  isMain: boolean;
  stock: number;
  batchesCount: number;
  nearestExpiry: string | null;
}

export interface InventoryMatrixItem {
  id: string;
  name: string;
  barcode?: string | null;
  scientificName?: string | null;
  category?: { id: string; name: string } | null;
  sellingPrice: number;
  minimumStock: number;
  totalStock: number;
  isLowStock: boolean;
  branchStock: MatrixBranchStock[];
}

export interface InventoryMatrixResponse {
  branches: { id: string; name: string; code: string; isMain: boolean }[];
  items: InventoryMatrixItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
