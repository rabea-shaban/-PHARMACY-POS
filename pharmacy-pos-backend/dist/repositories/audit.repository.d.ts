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
export declare class AuditRepository {
    log(data: CreateAuditLogDTO): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: import("@prisma/client").$Enums.AuditAction;
        entity: string;
        entityId: string | null;
        oldData: string | null;
        newData: string | null;
        metadata: string | null;
    } | null>;
}
export declare const auditRepository: AuditRepository;
