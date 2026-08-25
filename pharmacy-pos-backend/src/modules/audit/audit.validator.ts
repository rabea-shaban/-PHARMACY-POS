import { z } from 'zod';

const auditActionEnum = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'SALE',
  'PAYMENT',
  'RETURN',
  'INVENTORY_ADJUSTMENT',
] as const;

export const auditIdParamSchema = z.object({
  id: z.string().uuid('Audit Log ID must be a valid UUID'),
});

export const auditQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.string().uuid().optional(),
  action: z.enum(auditActionEnum).optional(),
  entity: z.string().optional(),
  entityId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const auditSummaryQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type AuditQueryDTO = z.infer<typeof auditQuerySchema>;
export type AuditSummaryQueryDTO = z.infer<typeof auditSummaryQuerySchema>;
