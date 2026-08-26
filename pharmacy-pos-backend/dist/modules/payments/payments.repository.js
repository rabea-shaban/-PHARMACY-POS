import { prisma } from '../../lib/prisma.js';
export class PaymentsRepository {
    defaultInclude = {
        createdBy: {
            select: {
                id: true,
                name: true,
            },
        },
        sale: {
            select: {
                id: true,
                invoiceNumber: true,
            },
        },
    };
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { saleId, paymentMethod, createdById, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const where = {};
        if (saleId) {
            where.saleId = saleId;
        }
        if (paymentMethod) {
            where.paymentMethod = paymentMethod;
        }
        if (createdById) {
            where.createdById = createdById;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                include: this.defaultInclude,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.payment.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return prisma.payment.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
    }
    async findBySaleId(saleId) {
        return prisma.payment.findMany({
            where: { saleId },
            include: this.defaultInclude,
            orderBy: { createdAt: 'asc' },
        });
    }
}
export const paymentsRepository = new PaymentsRepository();
//# sourceMappingURL=payments.repository.js.map