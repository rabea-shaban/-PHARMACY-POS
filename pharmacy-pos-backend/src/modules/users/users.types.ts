import { Role } from '@prisma/client';
import { SafeUser } from '../../types/auth.types.js';
import { PaginationMeta } from '../../types/common.types.js';

export interface CreateUserInput {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: Role;
  branchId?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: Role;
  branchId?: string | null;
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  branchId?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsersResponse {
  items: SafeUser[];
  pagination: PaginationMeta;
}
