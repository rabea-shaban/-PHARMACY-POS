export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  productCount?: number;
}

export interface Batch {
  id: string;
  productId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  isNearExpiry?: boolean;
  isExpired?: boolean;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  scientificName: string | null;
  description: string | null;
  categoryId: string;
  category?: Category;
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
  minimumStock: number;
  isActive: boolean;
  totalQuantity?: number;
  batches?: Batch[];
}
