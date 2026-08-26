import { prisma } from '../../lib/prisma.js';
export class ExpensesRepository {
    defaultInclude = {
        createdBy: {
            select: {
                id: true,
                name: true,
            },
        },
    };
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { search, category, paymentMethod, createdById, startDate, endDate, sortBy = 'expenseDate', sortOrder = 'desc' } = filters;
        const where = {};
        if (search) {
            where.description = { contains: search };
        }
        if (category) {
            where.category = category;
        }
        if (paymentMethod) {
            where.paymentMethod = paymentMethod;
        }
        if (createdById) {
            where.createdById = createdById;
        }
        if (startDate || endDate) {
            where.expenseDate = {};
            if (startDate)
                where.expenseDate.gte = new Date(startDate);
            if (endDate)
                where.expenseDate.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            prisma.expense.findMany({
                where,
                include: this.defaultInclude,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.expense.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return prisma.expense.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
    }
    async create(data) {
        return prisma.expense.create({
            data: {
                amount: data.amount,
                category: data.category,
                description: data.description,
                paymentMethod: data.paymentMethod,
                expenseDate: data.expenseDate,
                createdById: data.createdById,
            },
            include: this.defaultInclude,
        });
    }
    async update(id, data) {
        return prisma.expense.update({
            where: { id },
            data,
            include: this.defaultInclude,
        });
    }
    async delete(id) {
        return prisma.expense.delete({
            where: { id },
            include: this.defaultInclude,
        });
    }
    async getSummary(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.expenseDate = {};
            if (startDate)
                where.expenseDate.gte = startDate;
            if (endDate)
                where.expenseDate.lte = endDate;
        }
        const expenses = await prisma.expense.findMany({ where });
        let totalExpenses = 0;
        const catMap = new Map();
        const pmMap = new Map();
        for (const exp of expenses) {
            const amt = Number(exp.amount);
            totalExpenses += amt;
            const catEntry = catMap.get(exp.category) || { totalAmount: 0, count: 0 };
            catEntry.totalAmount += amt;
            catEntry.count += 1;
            catMap.set(exp.category, catEntry);
            const pmEntry = pmMap.get(exp.paymentMethod) || { totalAmount: 0, count: 0 };
            pmEntry.totalAmount += amt;
            pmEntry.count += 1;
            pmMap.set(exp.paymentMethod, pmEntry);
        }
        return {
            totalExpenses: Number(totalExpenses.toFixed(2)),
            expensesCount: expenses.length,
            categoryBreakdown: Array.from(catMap.entries()).map(([category, data]) => ({
                category,
                totalAmount: Number(data.totalAmount.toFixed(2)),
                count: data.count,
            })),
            paymentMethodBreakdown: Array.from(pmMap.entries()).map(([paymentMethod, data]) => ({
                paymentMethod,
                totalAmount: Number(data.totalAmount.toFixed(2)),
                count: data.count,
            })),
        };
    }
}
export const expensesRepository = new ExpensesRepository();
//# sourceMappingURL=expenses.repository.js.map