import { AuditAction } from '@prisma/client';

export interface CreateAuditLogDTO {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  oldData?: Record<string, unknown> | string | null;
  newData?: Record<string, unknown> | string | null;
  metadata?: Record<string, unknown> | string | null;
}
