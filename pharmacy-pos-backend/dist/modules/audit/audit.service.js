import { auditRepository } from './audit.repository.js';
import { parseDateRange } from '../../utils/date.util.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError } from '../../utils/errors.js';
function parseJsonSafe(val) {
    if (!val)
        return null;
    try {
        return JSON.parse(val);
    }
    catch {
        return val;
    }
}
function formatAuditLog(raw) {
    return {
        id: raw.id,
        userId: raw.userId,
        userName: raw.user?.name || 'System / Anonymous',
        userRole: raw.user?.role || null,
        action: raw.action,
        entity: raw.entity,
        entityId: raw.entityId,
        oldData: parseJsonSafe(raw.oldData),
        newData: parseJsonSafe(raw.newData),
        metadata: parseJsonSafe(raw.metadata),
        createdAt: raw.createdAt,
    };
}
export class AuditService {
    repo;
    constructor(repo = auditRepository) {
        this.repo = repo;
    }
    async logAction(data) {
        return this.repo.log(data);
    }
    async getAuditLogs(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany({
            page,
            limit,
            userId: filters.userId,
            action: filters.action,
            entity: filters.entity,
            entityId: filters.entityId,
            from: filters.from,
            to: filters.to,
        });
        return {
            items: items.map(formatAuditLog),
            pagination: getPaginationMeta(total, page, limit),
        };
    }
    async getAuditLogById(id) {
        const log = await this.repo.findById(id);
        if (!log) {
            throw new NotFoundError(`Audit log with ID '${id}' not found`);
        }
        return formatAuditLog(log);
    }
    async getActivitySummary(from, to) {
        let startDate;
        let endDate;
        if (from || to) {
            const parsed = parseDateRange(from, to);
            startDate = parsed.startDate;
            endDate = parsed.endDate;
        }
        const summary = await this.repo.getSummary(startDate, endDate);
        return {
            ...(from || to ? { period: { from: from || '', to: to || '' } } : {}),
            ...summary,
        };
    }
}
export const auditService = new AuditService();
//# sourceMappingURL=audit.service.js.map