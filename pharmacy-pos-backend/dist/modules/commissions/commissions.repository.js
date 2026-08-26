import { prisma } from '../../lib/prisma.js';
export class CommissionsRepository {
    defaultTransactionInclude = {
        user: {
            select: {
                id: true,
                name: true,
                role: true,
            },
        },
        sale: {
            select: {
                id: true,
                invoiceNumber: true,
            },
        },
        commissionRule: {
            select: {
                id: true,
                name: true,
            },
        },
    };
    async findRules() {
        return prisma.commissionRule.findMany({
            orderBy: { effectiveDate: 'desc' },
        });
    }
    async findRuleById(id) {
        return prisma.commissionRule.findUnique({
            where: { id },
        });
    }
    async findActiveRule() {
        return prisma.commissionRule.findFirst({
            where: { isActive: true },
            orderBy: { effectiveDate: 'desc' },
        });
    }
    async createRule(data) {
        return prisma.commissionRule.create({
            data: {
                name: data.name,
                percentage: data.percentage,
                fixedAmount: data.fixedAmount || null,
                effectiveDate: data.effectiveDate || new Date(),
                isActive: true,
            },
        });
    }
    async updateRule(id, data) {
        return prisma.commissionRule.update({
            where: { id },
            data,
        });
    }
    async findTransactions(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { userId, saleId, commissionRuleId, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const where = {};
        if (userId)
            where.userId = userId;
        if (saleId)
            where.saleId = saleId;
        if (commissionRuleId)
            where.commissionRuleId = commissionRuleId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            prisma.commissionTransaction.findMany({
                where,
                include: this.defaultTransactionInclude,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.commissionTransaction.count({ where }),
        ]);
        return { items, total };
    }
    async getSummary(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const transactions = await prisma.commissionTransaction.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, role: true } },
            },
        });
        let totalCommissionsPaid = 0;
        let totalSalesVolume = 0;
        const staffMap = new Map();
        for (const tx of transactions) {
            const commAmount = Number(tx.commissionAmount);
            const salesAmount = Number(tx.salesAmount);
            totalCommissionsPaid += commAmount;
            totalSalesVolume += salesAmount;
            const existing = staffMap.get(tx.userId) || {
                userId: tx.userId,
                userName: tx.user.name,
                userRole: tx.user.role,
                totalCommissions: 0,
                salesCount: 0,
            };
            existing.totalCommissions += commAmount;
            existing.salesCount += 1;
            staffMap.set(tx.userId, existing);
        }
        return {
            totalCommissionsPaid: Number(totalCommissionsPaid.toFixed(2)),
            totalSalesVolume: Number(totalSalesVolume.toFixed(2)),
            transactionsCount: transactions.length,
            staffSummary: Array.from(staffMap.values()),
        };
    }
}
export const commissionsRepository = new CommissionsRepository();
//# sourceMappingURL=commissions.repository.js.map