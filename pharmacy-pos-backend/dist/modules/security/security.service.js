import { securityRepository } from './security.repository.js';
import { parseDateRange } from '../../utils/date.util.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
function parseJsonSafe(val) {
    if (!val)
        return {};
    try {
        return JSON.parse(val);
    }
    catch {
        return {};
    }
}
function formatSecurityLog(raw) {
    const meta = parseJsonSafe(raw.metadata);
    return {
        id: raw.id,
        userId: raw.userId,
        userName: raw.user?.name || null,
        userRole: raw.user?.role || null,
        status: meta.status || 'SUCCESS',
        phone: meta.phone,
        reason: meta.reason,
        ip: meta.ip,
        userAgent: meta.userAgent,
        createdAt: raw.createdAt,
    };
}
export class SecurityService {
    repo;
    constructor(repo = securityRepository) {
        this.repo = repo;
    }
    async getLoginLogs(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findLoginLogs({
            page,
            limit,
            userId: filters.userId,
            status: filters.status,
            from: filters.from,
            to: filters.to,
        });
        return {
            items: items.map(formatSecurityLog),
            pagination: getPaginationMeta(total, page, limit),
        };
    }
    async getStats(from, to) {
        let startDate;
        let endDate;
        if (from || to) {
            const parsed = parseDateRange(from, to);
            startDate = parsed.startDate;
            endDate = parsed.endDate;
        }
        const stats = await this.repo.getStats(startDate, endDate);
        return {
            ...(from || to ? { period: { from: from || '', to: to || '' } } : {}),
            ...stats,
        };
    }
}
export const securityService = new SecurityService();
//# sourceMappingURL=security.service.js.map