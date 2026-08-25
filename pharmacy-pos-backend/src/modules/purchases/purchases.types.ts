import { PurchaseStatus } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface PurchaseItemInput {
  productId: string;
  quantity: number;
  unitCost: number;
  discount?: number;
  tax?: number;
  batchNumber?: string;
  expiryDate?: string | Date;
  sellingPrice?: number;
}

export interface PurchaseItemResponse {
  id: string;
  purchaseId: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    barcode: string;
  };
  batchId: string | null;
  batch?: {
    id: string;
    batchNumber: string;
    expiryDate: Date;
    quantity: number;
  } | null;
  quantity: number;
  unitCost: number;
  discount: number;
  tax: number;
  total: number;
}

export interface PurchaseResponse {
  id: string;
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
    phone: string;
  };
  invoiceNumber: string;
  purchaseDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: PurchaseStatus;
  notes: string | null;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
  items?: PurchaseItemResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePurchaseInput {
  supplierId: string;
  invoiceNumber: string;
  purchaseDate?: string | Date;
  discount?: number;
  tax?: number;
  paidAmount?: number;
  notes?: string | null;
  items: PurchaseItemInput[];
}

export interface UpdatePurchaseInput {
  notes?: string | null;
  discount?: number;
  tax?: number;
  paidAmount?: number;
}

export interface ReceivePurchaseItemData {
  itemId?: string;
  productId: string;
  batchNumber: string;
  expiryDate: string | Date;
  sellingPrice?: number;
}

export interface ReceivePurchaseInput {
  items?: ReceivePurchaseItemData[];
}

export interface PurchaseQueryFilters {
  page?: number;
  limit?: number;
  supplierId?: string;
  invoiceNumber?: string;
  status?: PurchaseStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  sortBy?: 'purchaseDate' | 'total' | 'invoiceNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPurchasesResponse {
  items: PurchaseResponse[];
  pagination: PaginationMeta;
}
