import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../api/auditApi.js';
import { AuditQueryParams, AuditSummaryQueryParams } from '../types/audit.types.js';

export function useAuditLogs(params?: AuditQueryParams) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditApi.getAuditLogs(params),
    staleTime: 30 * 1000,
  });
}

export function useAuditSummary(params?: AuditSummaryQueryParams) {
  return useQuery({
    queryKey: ['audit-summary', params],
    queryFn: () => auditApi.getAuditSummary(params),
    staleTime: 60 * 1000,
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ['audit-logs', id],
    queryFn: () => auditApi.getAuditLogById(id),
    enabled: Boolean(id),
  });
}
