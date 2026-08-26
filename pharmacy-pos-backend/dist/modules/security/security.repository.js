import { prisma } from '../../lib/prisma.js';
export class SecurityRepository {
    defaultInclude = {
        user: {
            select: {
                id: true,
                name: true,
                role: true,
            },
        },
    };
    async findLoginLogs(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const where = {
            action: 'LOGIN',
        };
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.from || filters.to) {
            where.createdAt = {
                ...(filters.from ? { gte: new Date(filters.from) } : {}),
                ...(filters.to ? { lte: new Date(filters.to) } : {}),
            };
        }
        if (filters.status) {
            where.metadata = {
                contains: `"status":"${filters.status}"`,
            };
        }
        const [items, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: this.defaultInclude,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.auditLog.count({ where }),
        ]);
        return { items, total };
    }
    async getStats(startDate, endDate) {
        const where = {
            action: 'LOGIN',
            ...(startDate || endDate
                ? {
                    createdAt: {
                        ...(startDate ? { gte: startDate } : {}),
                        ...(endDate ? { lte: endDate } : {}),
                    },
                }
                : {}),
        };
        const logs = await prisma.auditLog.findMany({
            where,
            select: { metadata: true },
        });
        let successfulLogins = 0;
        let failedLogins = 0;
        for (const l of logs) {
            if (l.metadata && l.metadata.includes('"status":"SUCCESS"')) {
                successfulLogins++;
            }
            else if (l.metadata && l.metadata.includes('"status":"FAILED"')) {
                failedLogins++;
            }
        }
        const totalLoginAttempts = logs.length;
        const failureRatePercentage = totalLoginAttempts > 0 ? Number(((failedLogins / totalLoginAttempts) * 100).toFixed(2)) : 0;
        return {
            totalLoginAttempts,
            successfulLogins,
            failedLogins,
            failureRatePercentage,
        };
    }
}
export const securityRepository = new SecurityRepository();
//# sourceMappingURL=security.repository.js.map