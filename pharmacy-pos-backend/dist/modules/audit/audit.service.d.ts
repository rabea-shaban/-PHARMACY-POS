import { AuditRepository } from './audit.repository.js';
import { CreateAuditLogDTO, AuditLogResponse, PaginatedAuditLogsResponse, AuditActivitySummaryResponse } from './audit.types.js';
import { AuditQueryDTO } from './audit.validator.js';
export declare class AuditService {
    private readonly repo;
    constructor(repo?: AuditRepository);
    logAction(data: CreateAuditLogDTO): Promise<({
        user: {
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: import("@prisma/client").$Enums.AuditAction;
        entity: string;
        entityId: string | null;
        oldData: string | null;
        newData: string | null;
        metadata: string | null;
    }) | null>;
    getAuditLogs(filters: AuditQueryDTO): Promise<PaginatedAuditLogsResponse>;
    getAuditLogById(id: string): Promise<AuditLogResponse>;
    getActivitySummary(from?: string, to?: string): Promise<AuditActivitySummaryResponse>;
}
export declare const auditService: AuditService;
