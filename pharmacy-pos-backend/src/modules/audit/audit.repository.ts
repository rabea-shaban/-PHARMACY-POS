import { prisma } from '../../lib/prisma.js';
import { CreateAuditLogDTO } from './audit.types.js';

function stringifySafe(val?: Record<string, unknown> | string | null): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch {
    return null;
  }
}

export class AuditRepository {
  async log(data: CreateAuditLogDTO) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: data.userId || null,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId || null,
          oldData: stringifySafe(data.oldData),
          newData: stringifySafe(data.newData),
          metadata: stringifySafe(data.metadata),
        },
      });
    } catch (error) {
      console.warn('⚠️ Audit log creation error:', (error as Error).message);
      return null;
    }
  }
}

export const auditRepository = new AuditRepository();
