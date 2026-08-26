import { SecurityQueryFilters } from './security.types.js';
export declare class SecurityRepository {
    private readonly defaultInclude;
    findLoginLogs(filters: SecurityQueryFilters): Promise<{
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
    getStats(startDate?: Date, endDate?: Date): Promise<{
        totalLoginAttempts: number;
        successfulLogins: number;
        failedLogins: number;
        failureRatePercentage: number;
    }>;
}
export declare const securityRepository: SecurityRepository;
