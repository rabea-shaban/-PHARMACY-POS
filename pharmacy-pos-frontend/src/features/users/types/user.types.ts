import { Role } from '../../../types/auth.types.js';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    code: string;
    isMain?: boolean;
    isActive?: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  role: Role;
  branchId?: string | null;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  email?: string | null;
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

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
}
