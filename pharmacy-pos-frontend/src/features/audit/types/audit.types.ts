export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'SALE'
  | 'PAYMENT'
  | 'RETURN'
  | 'INVENTORY_ADJUSTMENT';

export interface AuditLog {
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
  createdAt: string;
}

export interface AuditQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: AuditAction;
  entity?: string;
  entityId?: string;
  from?: string;
  to?: string;
}

export interface AuditSummaryQueryParams {
  from?: string;
  to?: string;
}

export interface AuditActivitySummary {
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
