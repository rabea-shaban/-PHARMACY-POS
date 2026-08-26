import { commissionsRepository } from './commissions.repository.js';
import { auditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError } from '../../utils/errors.js';
function formatRule(raw) {
    return {
        id: raw.id,
        name: raw.name,
        percentage: Number(raw.percentage),
        fixedAmount: raw.fixedAmount ? Number(raw.fixedAmount) : null,
        isActive: raw.isActive,
        effectiveDate: raw.effectiveDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
}
function formatTransaction(raw) {
    return {
        id: raw.id,
        userId: raw.userId,
        userName: raw.user?.name || undefined,
        userRole: raw.user?.role || undefined,
        saleId: raw.saleId,
        invoiceNumber: raw.sale?.invoiceNumber || undefined,
        commissionRuleId: raw.commissionRuleId,
        commissionRuleName: raw.commissionRule?.name || undefined,
        salesAmount: Number(raw.salesAmount),
        commissionAmount: Number(raw.commissionAmount),
        commissionRate: Number(raw.commissionRate),
        createdAt: raw.createdAt,
    };
}
export class CommissionsService {
    repo;
    audit;
    constructor(repo = commissionsRepository, audit = auditService) {
        this.repo = repo;
        this.audit = audit;
    }
    async getRules() {
        const rules = await this.repo.findRules();
        return rules.map(formatRule);
    }
    async getRuleById(id) {
        const rule = await this.repo.findRuleById(id);
        if (!rule) {
            throw new NotFoundError(`Commission rule with ID '${id}' not found`);
        }
        return formatRule(rule);
    }
    async getActiveRule() {
        const rule = await this.repo.findActiveRule();
        return rule ? formatRule(rule) : null;
    }
    async createRule(input, actorId) {
        const created = await this.repo.createRule({
            name: input.name.trim(),
            percentage: input.percentage,
            fixedAmount: input.fixedAmount,
            effectiveDate: input.effectiveDate ? new Date(input.effectiveDate) : undefined,
        });
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'CREATE',
            entity: 'commission_rules',
            entityId: created.id,
            newData: { name: created.name, percentage: input.percentage },
        });
        return formatRule(created);
    }
    async updateRule(id, input, actorId) {
        const existing = await this.repo.findRuleById(id);
        if (!existing) {
            throw new NotFoundError(`Commission rule with ID '${id}' not found`);
        }
        const updateData = {};
        if (input.name)
            updateData.name = input.name.trim();
        if (input.percentage !== undefined)
            updateData.percentage = input.percentage;
        if (input.fixedAmount !== undefined)
            updateData.fixedAmount = input.fixedAmount;
        if (typeof input.isActive === 'boolean')
            updateData.isActive = input.isActive;
        if (input.effectiveDate)
            updateData.effectiveDate = new Date(input.effectiveDate);
        const updated = await this.repo.updateRule(id, updateData);
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'UPDATE',
            entity: 'commission_rules',
            entityId: id,
            oldData: { name: existing.name, percentage: Number(existing.percentage), isActive: existing.isActive },
            newData: { name: updated.name, percentage: Number(updated.percentage), isActive: updated.isActive },
        });
        return formatRule(updated);
    }
    async getTransactions(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findTransactions(filters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatTransaction),
            pagination,
        };
    }
    async getStaffTransactions(userId, filters) {
        return this.getTransactions({ ...filters, userId });
    }
    async getSummary(startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.repo.getSummary(start, end);
    }
}
export const commissionsService = new CommissionsService();
//# sourceMappingURL=commissions.service.js.map