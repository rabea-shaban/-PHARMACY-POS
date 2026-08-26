import { prisma } from '../../lib/prisma.js';
function stringifySafe(val) {
    if (!val)
        return null;
    if (typeof val === 'string')
        return val;
    try {
        return JSON.stringify(val);
    }
    catch {
        return null;
    }
}
export class AuditRepository {
    defaultInclude = {
        user: {
            select: {
                id: true,
                name: true,
                role: true,
            },
        },
    };
    async log(data) {
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
                include: this.defaultInclude,
            });
        }
        catch (error) {
            console.warn('⚠️ Audit log creation error:', error.message);
            return null;
        }
    }
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.action)
            where.action = filters.action;
        if (filters.entity)
            where.entity = { contains: filters.entity };
        if (filters.entityId)
            where.entityId = filters.entityId;
        if (filters.from || filters.to) {
            where.createdAt = {
                ...(filters.from ? { gte: new Date(filters.from) } : {}),
                ...(filters.to ? { lte: new Date(filters.to) } : {}),
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
    async findById(id) {
        return prisma.auditLog.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
    }
    async getSummary(startDate, endDate) {
        const where = {
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
            include: this.defaultInclude,
        });
        const actionMap = new Map();
        const entityMap = new Map();
        const actorMap = new Map();
        for (const log of logs) {
            // Action count
            actionMap.set(log.action, (actionMap.get(log.action) || 0) + 1);
            // Entity count
            entityMap.set(log.entity, (entityMap.get(log.entity) || 0) + 1);
            // Actor count
            if (log.userId && log.user) {
                const actor = actorMap.get(log.userId) || {
                    userId: log.userId,
                    userName: log.user.name,
                    count: 0,
                };
                actor.count++;
                actorMap.set(log.userId, actor);
            }
        }
        const actionDistribution = Array.from(actionMap.entries()).map(([action, count]) => ({
            action,
            count,
        }));
        const entityDistribution = Array.from(entityMap.entries()).map(([entity, count]) => ({
            entity,
            count,
        }));
        const topActors = Array.from(actorMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((a) => ({
            userId: a.userId,
            userName: a.userName,
            actionCount: a.count,
        }));
        return {
            totalLogsCount: logs.length,
            actionDistribution,
            entityDistribution,
            topActors,
        };
    }
}
export const auditRepository = new AuditRepository();
//# sourceMappingURL=audit.repository.js.map