import { PaginationMeta } from '../../types/common.types.js';

export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CategoryQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedCategoriesResponse {
  items: CategoryResponse[];
  pagination: PaginationMeta;
}
