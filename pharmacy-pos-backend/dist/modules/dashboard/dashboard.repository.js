import { prisma } from '../../lib/prisma.js';
export class DashboardRepository {
    async getDashboardData(startDate, endDate) {
        const now = new Date();
        const ninetyDaysFuture = new Date();
        ninetyDaysFuture.setDate(now.getDate() + 90);
        const [sales, saleReturns, expenses, activeProducts, batches, activeCustomersCount, loyaltyTransactions,] = await Promise.all([
            // 1. Sales in period (Excluding cancelled)
            prisma.sale.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { not: 'CANCELLED' },
                },
                include: {
                    items: {
                        include: {
                            batch: {
                                select: {
                                    purchasePrice: true,
                                },
                            },
                        },
                    },
                },
            }),
            // 2. Returns in period
            prisma.saleReturn.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                },
            }),
            // 3. Expenses in period
            prisma.expense.findMany({
                where: {
                    expenseDate: { gte: startDate, lte: endDate },
                },
            }),
            // 4. Products for low stock calculation
            prisma.product.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    minimumStock: true,
                    batches: {
                        where: { quantity: { gt: 0 } },
                        select: { quantity: true, expiryDate: true },
                    },
                },
            }),
            // 5. Active Batches for stock value and expiry alerts
            prisma.batch.findMany({
                where: {
                    quantity: { gt: 0 },
                },
                select: {
                    id: true,
                    quantity: true,
                    purchasePrice: true,
                    expiryDate: true,
                },
            }),
            // 6. Active Customers
            prisma.customer.count({
                where: { isActive: true },
            }),
            // 7. Loyalty transactions in period
            prisma.loyaltyTransaction.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                },
                select: {
                    type: true,
                    points: true,
                },
            }),
        ]);
        return {
            sales,
            saleReturns,
            expenses,
            activeProducts,
            batches,
            activeCustomersCount,
            loyaltyTransactions,
        };
    }
}
export const dashboardRepository = new DashboardRepository();
//# sourceMappingURL=dashboard.repository.js.map