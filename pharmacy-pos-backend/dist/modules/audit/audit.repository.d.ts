import { CreateAuditLogDTO, AuditQueryFilters } from './audit.types.js';
export declare class AuditRepository {
    private readonly defaultInclude;
    log(data: CreateAuditLogDTO): Promise<({
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
    findMany(filters: AuditQueryFilters): Promise<{
        items: ({
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
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
    getSummary(startDate?: Date, endDate?: Date): Promise<{
        totalLogsCount: number;
        actionDistribution: {
            action: import("@prisma/client").$Enums.AuditAction;
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
    }>;
}
export declare const auditRepository: AuditRepository;
