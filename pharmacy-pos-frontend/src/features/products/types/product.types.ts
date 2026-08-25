export interface Category {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface ProductBatch {
  id: string;
  batchNumber: string;
  productId: string;
  quantity: number;
  initialQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  scientificName?: string | null;
  description?: string | null;
  categoryId: string;
  category?: Category;
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
  minimumStock: number;
  currentStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  batches?: ProductBatch[];
}

export interface ProductStockSummary {
  productId: string;
  productName: string;
  barcode: string;
  totalStock: number;
  minimumStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  activeBatchesCount: number;
  batches: ProductBatch[];
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  barcode?: string;
  categoryId?: string;
  isActive?: boolean;
}
