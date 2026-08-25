import { AuditAction } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface CreateAuditLogDTO {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  oldData?: Record<string, unknown> | string | null;
  newData?: Record<string, unknown> | string | null;
  metadata?: Record<string, unknown> | string | null;
}

export interface AuditLogResponse {
  id: string;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  action: AuditAction;
  entity: string;
  entityId: string | null;
  oldData: any | null;
  newData: any | null;
  metadata: any | null;
  createdAt: Date;
}

export interface AuditQueryFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: AuditAction;
  entity?: string;
  entityId?: string;
  from?: string;
  to?: string;
}

export interface PaginatedAuditLogsResponse {
  items: AuditLogResponse[];
  pagination: PaginationMeta;
}

export interface AuditActivitySummaryResponse {
  period?: {
    from: string;
    to: string;
  };
  totalLogsCount: number;
  actionDistribution: {
    action: AuditAction;
    count: number;
  }[];
  entityDistribution: {
    entity: string;
    count: number;
  }[];
  topActors: {
    userId: string;
    userName: string;
    actionCount: number;
  }[];
}
