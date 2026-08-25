import { PaginationMeta } from '../../types/common.types.js';

export interface SecurityEventLogResponse {
  id: string;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  status: 'SUCCESS' | 'FAILED';
  phone?: string;
  reason?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SecurityQueryFilters {
  page?: number;
  limit?: number;
  userId?: string;
  status?: 'SUCCESS' | 'FAILED';
  from?: string;
  to?: string;
}

export interface PaginatedSecurityLogsResponse {
  items: SecurityEventLogResponse[];
  pagination: PaginationMeta;
}

export interface SecurityStatsResponse {
  period?: {
    from: string;
    to: string;
  };
  totalLoginAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  failureRatePercentage: number;
}
