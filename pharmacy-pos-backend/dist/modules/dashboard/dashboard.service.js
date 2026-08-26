import { dashboardRepository } from './dashboard.repository.js';
import { parseDateRange } from '../../utils/date.util.js';
export class DashboardService {
    repo;
    constructor(repo = dashboardRepository) {
        this.repo = repo;
    }
    async getOverview(from, to) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(from, to);
        const data = await this.repo.getDashboardData(startDate, endDate);
        const now = new Date();
        const ninetyDays = new Date();
        ninetyDays.setDate(now.getDate() + 90);
        // 1. Sales & Refunds calculation
        const grossSales = data.sales.reduce((sum, s) => sum + Number(s.total), 0);
        const totalInvoices = data.sales.length;
        const refundsAmount = data.saleReturns.reduce((sum, r) => sum + Number(r.total), 0);
        const refundsCount = data.saleReturns.length;
        const netSales = Number(Math.max(0, grossSales - refundsAmount).toFixed(2));
        const averageInvoiceValue = totalInvoices > 0 ? Number((grossSales / totalInvoices).toFixed(2)) : 0;
        // 2. Cost of Goods Sold (COGS) & Estimated Margin
        let totalCogs = 0;
        for (const sale of data.sales) {
            for (const item of sale.items) {
                const unitCost = item.batch ? Number(item.batch.purchasePrice) : 0;
                totalCogs += unitCost * item.quantity;
            }
        }
        const estimatedCostOfGoodsSold = Number(totalCogs.toFixed(2));
        const estimatedGrossMargin = Number((netSales - estimatedCostOfGoodsSold).toFixed(2));
        const estimatedGrossMarginPercentage = netSales > 0 ? Number(((estimatedGrossMargin / netSales) * 100).toFixed(2)) : 0;
        // 3. Expenses
        const totalExpenses = Number(data.expenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2));
        const expensesCount = data.expenses.length;
        const netOperationalRevenue = Number((netSales - totalExpenses).toFixed(2));
        // 4. Inventory Health & Expiry Horizons
        let totalStockUnits = 0;
        let derivableInventoryValue = 0;
        let expiringSoonBatchesCount = 0;
        let expiredBatchesCount = 0;
        for (const b of data.batches) {
            totalStockUnits += b.quantity;
            derivableInventoryValue += b.quantity * Number(b.purchasePrice);
            const exp = new Date(b.expiryDate);
            if (exp <= now) {
                expiredBatchesCount++;
            }
            else if (exp <= ninetyDays) {
                expiringSoonBatchesCount++;
            }
        }
        // Low stock product calculation
        let lowStockProductsCount = 0;
        for (const p of data.activeProducts) {
            const currentStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
            if (currentStock <= p.minimumStock) {
                lowStockProductsCount++;
            }
        }
        // 5. Customers & Loyalty
        let pointsEarnedInPeriod = 0;
        let pointsRedeemedInPeriod = 0;
        for (const lt of data.loyaltyTransactions) {
            if (lt.type === 'EARN') {
                pointsEarnedInPeriod += Math.abs(lt.points);
            }
            else if (lt.type === 'REDEEM') {
                pointsRedeemedInPeriod += Math.abs(lt.points);
            }
        }
        const totalAlerts = lowStockProductsCount + expiringSoonBatchesCount + expiredBatchesCount;
        return {
            period: {
                from: fromStr,
                to: toStr,
            },
            sales: {
                grossSales: Number(grossSales.toFixed(2)),
                totalInvoices,
                refundsAmount: Number(refundsAmount.toFixed(2)),
                refundsCount,
                netSales,
                averageInvoiceValue,
            },
            expenses: {
                totalExpenses,
                expensesCount,
            },
            financialSummary: {
                netOperationalRevenue,
                estimatedCostOfGoodsSold,
                estimatedGrossMargin,
                estimatedGrossMarginPercentage,
            },
            inventory: {
                totalActiveProducts: data.activeProducts.length,
                totalStockUnits,
                derivableInventoryValue: Number(derivableInventoryValue.toFixed(2)),
                lowStockProductsCount,
                expiringSoonBatchesCount,
                expiredBatchesCount,
            },
            customersAndLoyalty: {
                totalActiveCustomers: data.activeCustomersCount,
                pointsEarnedInPeriod,
                pointsRedeemedInPeriod,
            },
            operationalAlerts: {
                totalAlerts,
                lowStockAlerts: lowStockProductsCount,
                expiryAlerts: expiringSoonBatchesCount + expiredBatchesCount,
            },
        };
    }
}
export const dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map