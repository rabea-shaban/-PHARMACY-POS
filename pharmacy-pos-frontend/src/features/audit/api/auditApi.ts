import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  AuditLog,
  AuditQueryParams,
  AuditSummaryQueryParams,
  AuditActivitySummary,
} from '../types/audit.types.js';

export const auditApi = {
  // 1. Query paginated audit logs with filters
  getAuditLogs: async (params?: AuditQueryParams): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<AuditLog>>>('/audit-logs', {
      params,
    });
    return response.data.data;
  },

  // 2. Get activity summary & action/entity distribution
  getAuditSummary: async (params?: AuditSummaryQueryParams): Promise<AuditActivitySummary> => {
    const response = await api.get<ApiResponse<AuditActivitySummary>>('/audit-logs/summary', {
      params,
    });
    return response.data.data;
  },

  // 3. Get single audit log entry by ID
  getAuditLogById: async (id: string): Promise<AuditLog> => {
    const response = await api.get<ApiResponse<AuditLog>>(`/audit-logs/${id}`);
    return response.data.data;
  },
};
