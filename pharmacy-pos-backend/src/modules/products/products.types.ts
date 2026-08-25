import { PaginationMeta } from '../../types/common.types.js';

export interface ProductBatchSummary {
  id: string;
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  daysToExpiry?: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  barcode: string;
  scientificName: string | null;
  description: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
  minimumStock: number;
  currentStock: number;
  isLowStock: boolean;
  isActive: boolean;
  batches?: ProductBatchSummary[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductStockSummaryResponse {
  product: {
    id: string;
    name: string;
    barcode: string;
    category: string;
    minimumStock: number;
    purchasePrice: number;
    sellingPrice: number;
  };
  totalStock: number;
  activeBatchesCount: number;
  expiredQuantity: number;
  expiringSoonQuantity: number;
  isLowStock: boolean;
  batches: ProductBatchSummary[];
}

export interface CreateProductInput {
  name: string;
  barcode: string;
  scientificName?: string | null;
  description?: string | null;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  taxRate?: number;
  minimumStock?: number;
}

export interface UpdateProductInput {
  name?: string;
  barcode?: string;
  scientificName?: string | null;
  description?: string | null;
  categoryId?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  taxRate?: number;
  minimumStock?: number;
  isActive?: boolean;
}

export interface ProductQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  barcode?: string;
  categoryId?: string;
  isActive?: boolean;
  lowStock?: boolean;
  sortBy?: 'name' | 'barcode' | 'sellingPrice' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchQueryFilters {
  q?: string;
  name?: string;
  barcode?: string;
  categoryId?: string;
  limit?: number;
}

export interface PaginatedProductsResponse {
  items: ProductResponse[];
  pagination: PaginationMeta;
}

export interface LowStockProductItem {
  id: string;
  name: string;
  barcode: string;
  category: string;
  minimumStock: number;
  currentStock: number;
  difference: number;
}

export interface ExpiringProductItem {
  id: string;
  name: string;
  barcode: string;
  category: string;
  batchNumber: string;
  expiryDate: Date;
  daysRemaining: number;
  quantity: number;
}
