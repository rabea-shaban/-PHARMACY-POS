import { Role } from '../../../types/auth.types.js';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  role: Role;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  email?: string | null;
  password?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
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
