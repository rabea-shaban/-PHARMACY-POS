import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UserQueryParams,
  AuditLogItem,
  AuditLogQueryParams,
} from '../types/user.types.js';

export const usersApi = {
  // 1. Get list of staff users with pagination and search
  getUsers: async (params?: UserQueryParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params });
    return response.data.data;
  },

  // 2. Get user profile by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // 3. Create new staff user
  createUser: async (data: CreateUserPayload): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  // 4. Update staff user
  updateUser: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  // 5. Deactivate staff user (sets isActive: false)
  deactivateUser: async (id: string): Promise<User> => {
    const response = await api.delete<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // 6. Get user audit logs
  getUserAuditLogs: async (params?: AuditLogQueryParams): Promise<PaginatedResponse<AuditLogItem>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<AuditLogItem>>>('/audit-logs', {
      params,
    });
    return response.data.data;
  },
};
