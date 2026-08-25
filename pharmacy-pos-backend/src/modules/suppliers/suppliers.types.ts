import { PaginationMeta } from '../../types/common.types.js';

export interface SupplierResponse {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  taxNumber: string | null;
  notes: string | null;
  isActive: boolean;
  purchaseCount?: number;
  totalPurchaseAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierInput {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  taxNumber?: string | null;
  notes?: string | null;
}

export interface UpdateSupplierInput {
  name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  taxNumber?: string | null;
  notes?: string | null;
  isActive?: boolean;
}

export interface SupplierQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  phone?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'phone' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedSuppliersResponse {
  items: SupplierResponse[];
  pagination: PaginationMeta;
}
