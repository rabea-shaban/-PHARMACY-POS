import { Supplier } from '../../suppliers/types/supplier.types.js';
import { Product } from '../../products/types/product.types.js';

export type PurchaseStatus = 'PENDING' | 'RECEIVED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  product?: Product;
  productName?: string;
  barcode?: string;
  quantity: number;
  unitCost: number;
  discount: number;
  tax: number;
  total: number;
  batchNumber?: string | null;
  expiryDate?: string | null;
  sellingPrice?: number | null;
  receivedQuantity?: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  supplierName?: string;
  invoiceNumber: string;
  purchaseDate: string;
  status: PurchaseStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  notes?: string | null;
  items: PurchaseItem[];
  user?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseItemPayload {
  productId: string;
  quantity: number;
  unitCost: number;
  discount?: number;
  tax?: number;
  batchNumber?: string;
  expiryDate?: string;
  sellingPrice?: number;
}

export interface CreatePurchasePayload {
  supplierId: string;
  invoiceNumber: string;
  purchaseDate?: string;
  discount?: number;
  tax?: number;
  paidAmount?: number;
  notes?: string | null;
  items: CreatePurchaseItemPayload[];
}

export interface ReceivePurchaseItemPayload {
  itemId?: string;
  productId: string;
  batchNumber: string;
  expiryDate: string;
  sellingPrice?: number;
}

export interface ReceivePurchasePayload {
  items?: ReceivePurchaseItemPayload[];
}

export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  supplierId?: string;
  invoiceNumber?: string;
  status?: PurchaseStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'purchaseDate' | 'total' | 'invoiceNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
