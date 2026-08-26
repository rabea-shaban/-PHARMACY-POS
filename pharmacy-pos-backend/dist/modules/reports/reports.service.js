import { reportsRepository } from './reports.repository.js';
import { parseDateRange } from '../../utils/date.util.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
export class ReportsService {
    repo;
    constructor(repo = reportsRepository) {
        this.repo = repo;
    }
    // 1. Sales Report
    async getSalesReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getSalesReportData(filters, startDate, endDate);
        let totalGrossSales = 0;
        let totalItemsSold = 0;
        const productMap = new Map();
        const categoryMap = new Map();
        const dailyMap = new Map();
        for (const sale of data.allMatchingSales) {
            const saleTotal = Number(sale.total);
            totalGrossSales += saleTotal;
            const dateKey = sale.createdAt.toISOString().slice(0, 10);
            const dayEntry = dailyMap.get(dateKey) || { date: dateKey, salesCount: 0, grossAmount: 0 };
            dayEntry.salesCount++;
            dayEntry.grossAmount += saleTotal;
            dailyMap.set(dateKey, dayEntry);
            for (const item of sale.items) {
                totalItemsSold += item.quantity;
                const lineTotal = Number(item.total);
                // Product rollup
                const pEntry = productMap.get(item.productId) || {
                    productId: item.productId,
                    productName: item.product.name,
                    barcode: item.product.barcode,
                    quantitySold: 0,
                    revenue: 0,
                };
                pEntry.quantitySold += item.quantity;
                pEntry.revenue += lineTotal;
                productMap.set(item.productId, pEntry);
                // Category rollup
                if (item.product.categoryId) {
                    const cEntry = categoryMap.get(item.product.categoryId) || {
                        categoryId: item.product.categoryId,
                        categoryName: item.product.category?.name || 'Uncategorized',
                        quantitySold: 0,
                        revenue: 0,
                    };
                    cEntry.quantitySold += item.quantity;
                    cEntry.revenue += lineTotal;
                    categoryMap.set(item.product.categoryId, cEntry);
                }
            }
        }
        const returnedAmount = data.allReturns.reduce((sum, r) => sum + Number(r.total), 0);
        const netSales = Number(Math.max(0, totalGrossSales - returnedAmount).toFixed(2));
        const invoiceCount = data.totalInvoicesCount;
        const averageInvoiceValue = invoiceCount > 0 ? Number((totalGrossSales / invoiceCount).toFixed(2)) : 0;
        // Payment method breakdown
        const pmMap = new Map();
        for (const p of data.allPayments) {
            const entry = pmMap.get(p.paymentMethod) || { paymentMethod: p.paymentMethod, amount: 0, count: 0 };
            entry.amount += Number(p.amount);
            entry.count++;
            pmMap.set(p.paymentMethod, entry);
        }
        const topSellingProducts = Array.from(productMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map((p) => ({ ...p, revenue: Number(p.revenue.toFixed(2)) }));
        const topSellingCategories = Array.from(categoryMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map((c) => ({ ...c, revenue: Number(c.revenue.toFixed(2)) }));
        const dailyTrend = Array.from(dailyMap.values())
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((d) => ({ ...d, grossAmount: Number(d.grossAmount.toFixed(2)) }));
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const pagination = getPaginationMeta(data.totalInvoicesCount, page, limit);
        return {
            period: { from: fromStr, to: toStr },
            summary: {
                totalGrossSales: Number(totalGrossSales.toFixed(2)),
                invoiceCount,
                returnedAmount: Number(returnedAmount.toFixed(2)),
                netSales,
                averageInvoiceValue,
                totalItemsSold,
            },
            paymentMethodBreakdown: Array.from(pmMap.values()).map((p) => ({
                ...p,
                amount: Number(p.amount.toFixed(2)),
            })),
            topSellingProducts,
            topSellingCategories,
            dailyTrend,
            invoices: data.paginatedSales.map((s) => ({
                id: s.id,
                invoiceNumber: s.invoiceNumber,
                date: s.createdAt,
                cashierName: s.user.name,
                customerName: s.customer?.name || null,
                status: s.status,
                total: Number(s.total),
                itemsCount: s.items.length,
            })),
            pagination,
        };
    }
    // 2. Product Performance Report
    async getProductPerformanceReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getProductPerformanceData(filters, startDate, endDate);
        const SLOW_MOVING_THRESHOLD = 2;
        const salesMap = new Map();
        for (const si of data.saleItems) {
            const entry = salesMap.get(si.productId) || { quantity: 0, revenue: 0 };
            entry.quantity += si.quantity;
            entry.revenue += Number(si.total);
            salesMap.set(si.productId, entry);
        }
        const returnsMap = new Map();
        for (const ri of data.returnItems) {
            const entry = returnsMap.get(ri.productId) || { quantity: 0, refund: 0 };
            entry.quantity += ri.quantity;
            entry.refund += Number(ri.refundAmount);
            returnsMap.set(ri.productId, entry);
        }
        const items = [];
        let totalUnitsSold = 0;
        let totalRevenueGenerated = 0;
        for (const p of data.products) {
            const sales = salesMap.get(p.id) || { quantity: 0, revenue: 0 };
            const returns = returnsMap.get(p.id) || { quantity: 0, refund: 0 };
            const currentStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
            const netQuantity = Math.max(0, sales.quantity - returns.quantity);
            const netRevenue = Number(Math.max(0, sales.revenue - returns.refund).toFixed(2));
            totalUnitsSold += sales.quantity;
            totalRevenueGenerated += sales.revenue;
            items.push({
                productId: p.id,
                name: p.name,
                barcode: p.barcode,
                categoryName: p.category?.name || 'Uncategorized',
                purchasePrice: Number(p.purchasePrice),
                sellingPrice: Number(p.sellingPrice),
                currentStock,
                quantitySold: sales.quantity,
                revenueGenerated: Number(sales.revenue.toFixed(2)),
                returnQuantity: returns.quantity,
                returnAmount: Number(returns.refund.toFixed(2)),
                netQuantity,
                netRevenue,
            });
        }
        const topSellingProducts = items
            .filter((i) => i.netQuantity > SLOW_MOVING_THRESHOLD)
            .sort((a, b) => b.netRevenue - a.netRevenue);
        const slowMovingProducts = items
            .filter((i) => i.netQuantity > 0 && i.netQuantity <= SLOW_MOVING_THRESHOLD)
            .sort((a, b) => a.netQuantity - b.netQuantity);
        const zeroSalesProducts = items.filter((i) => i.quantitySold === 0);
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const paginatedItems = items.slice(skip, skip + limit);
        const pagination = getPaginationMeta(items.length, page, limit);
        return {
            period: { from: fromStr, to: toStr },
            thresholds: { slowMovingThreshold: SLOW_MOVING_THRESHOLD },
            summary: {
                totalProductsEvaluated: items.length,
                totalUnitsSold,
                totalRevenueGenerated: Number(totalRevenueGenerated.toFixed(2)),
                slowMovingCount: slowMovingProducts.length,
                zeroSalesCount: zeroSalesProducts.length,
            },
            topSellingProducts: topSellingProducts.slice(0, 10),
            slowMovingProducts: slowMovingProducts.slice(0, 10),
            zeroSalesProducts: zeroSalesProducts.slice(0, 10),
            allProducts: paginatedItems,
            pagination,
        };
    }
    // 3. Inventory Report
    async getInventoryReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getInventoryReportData(filters, startDate, endDate);
        const now = new Date();
        const ninetyDays = new Date();
        ninetyDays.setDate(now.getDate() + 90);
        let totalStockUnits = 0;
        let derivableInventoryCostValue = 0;
        let derivableInventoryRetailValue = 0;
        let healthyStockUnits = 0;
        let expiringSoonStockUnits = 0;
        let expiredStockUnits = 0;
        for (const b of data.activeBatches) {
            totalStockUnits += b.quantity;
            derivableInventoryCostValue += b.quantity * Number(b.purchasePrice);
            derivableInventoryRetailValue += b.quantity * Number(b.sellingPrice);
            const exp = new Date(b.expiryDate);
            if (exp <= now) {
                expiredStockUnits += b.quantity;
            }
            else if (exp <= ninetyDays) {
                expiringSoonStockUnits += b.quantity;
            }
            else {
                healthyStockUnits += b.quantity;
            }
        }
        const lowStockItems = [];
        for (const p of data.products) {
            const currentStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
            if (currentStock <= p.minimumStock) {
                lowStockItems.push({
                    productId: p.id,
                    productName: p.name,
                    barcode: p.barcode,
                    categoryName: p.category?.name || 'Uncategorized',
                    currentStock,
                    minimumStock: p.minimumStock,
                });
            }
        }
        // Stock movements summary
        const movementMap = new Map();
        for (const tx of data.inventoryTransactions) {
            const entry = movementMap.get(tx.type) || { type: tx.type, totalQuantity: 0, transactionCount: 0 };
            entry.totalQuantity += tx.quantity;
            entry.transactionCount++;
            movementMap.set(tx.type, entry);
        }
        return {
            period: { from: fromStr, to: toStr },
            summary: {
                totalProducts: data.products.length,
                totalActiveBatches: data.activeBatches.length,
                totalStockUnits,
                derivableInventoryCostValue: Number(derivableInventoryCostValue.toFixed(2)),
                derivableInventoryRetailValue: Number(derivableInventoryRetailValue.toFixed(2)),
            },
            health: {
                healthyStockUnits,
                expiringSoonStockUnits,
                expiredStockUnits,
                lowStockProductsCount: lowStockItems.length,
            },
            lowStockItems,
            stockMovementsSummary: Array.from(movementMap.values()),
        };
    }
    // 4. Purchase Report
    async getPurchaseReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getPurchaseReportData(filters, startDate, endDate);
        let totalPurchaseValue = 0;
        let totalAmountPaid = 0;
        let receivedInvoices = 0;
        let pendingInvoices = 0;
        let cancelledInvoices = 0;
        const supplierMap = new Map();
        const monthMap = new Map();
        for (const p of data.purchases) {
            const total = Number(p.total);
            const paid = Number(p.paidAmount);
            totalPurchaseValue += total;
            totalAmountPaid += paid;
            if (p.status === 'RECEIVED')
                receivedInvoices++;
            else if (p.status === 'PENDING')
                pendingInvoices++;
            else if (p.status === 'CANCELLED')
                cancelledInvoices++;
            // Supplier spending
            const sEntry = supplierMap.get(p.supplierId) || {
                supplierId: p.supplierId,
                supplierName: p.supplier.name,
                supplierPhone: p.supplier.phone,
                invoiceCount: 0,
                totalSpent: 0,
            };
            sEntry.invoiceCount++;
            sEntry.totalSpent += total;
            supplierMap.set(p.supplierId, sEntry);
            // Monthly trend
            const monthKey = p.createdAt.toISOString().slice(0, 7);
            const mEntry = monthMap.get(monthKey) || { month: monthKey, invoiceCount: 0, totalAmount: 0 };
            mEntry.invoiceCount++;
            mEntry.totalAmount += total;
            monthMap.set(monthKey, mEntry);
        }
        return {
            period: { from: fromStr, to: toStr },
            summary: {
                totalInvoices: data.purchases.length,
                receivedInvoices,
                pendingInvoices,
                cancelledInvoices,
                totalPurchaseValue: Number(totalPurchaseValue.toFixed(2)),
                totalAmountPaid: Number(totalAmountPaid.toFixed(2)),
                totalAmountRemaining: Number(Math.max(0, totalPurchaseValue - totalAmountPaid).toFixed(2)),
            },
            supplierSpendingBreakdown: Array.from(supplierMap.values())
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .map((s) => ({ ...s, totalSpent: Number(s.totalSpent.toFixed(2)) })),
            monthlyTrend: Array.from(monthMap.values())
                .sort((a, b) => a.month.localeCompare(b.month))
                .map((m) => ({ ...m, totalAmount: Number(m.totalAmount.toFixed(2)) })),
        };
    }
    // 5. Expense Report
    async getExpenseReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getExpenseReportData(filters, startDate, endDate);
        let totalExpenses = 0;
        const catMap = new Map();
        const pmMap = new Map();
        const dailyMap = new Map();
        for (const e of data.expenses) {
            const amt = Number(e.amount);
            totalExpenses += amt;
            // Category breakdown
            const cEntry = catMap.get(e.category) || { category: e.category, amount: 0, count: 0 };
            cEntry.amount += amt;
            cEntry.count++;
            catMap.set(e.category, cEntry);
            // Payment method breakdown
            const pEntry = pmMap.get(e.paymentMethod) || { paymentMethod: e.paymentMethod, amount: 0, count: 0 };
            pEntry.amount += amt;
            pEntry.count++;
            pmMap.set(e.paymentMethod, pEntry);
            // Daily trend
            const dateKey = e.expenseDate.toISOString().slice(0, 10);
            const dEntry = dailyMap.get(dateKey) || { date: dateKey, amount: 0, count: 0 };
            dEntry.amount += amt;
            dEntry.count++;
            dailyMap.set(dateKey, dEntry);
        }
        const expensesCount = data.expenses.length;
        const averageExpenseAmount = expensesCount > 0 ? Number((totalExpenses / expensesCount).toFixed(2)) : 0;
        return {
            period: { from: fromStr, to: toStr },
            summary: {
                totalExpenses: Number(totalExpenses.toFixed(2)),
                expensesCount,
                averageExpenseAmount,
            },
            categoryBreakdown: Array.from(catMap.values()).map((c) => ({
                ...c,
                amount: Number(c.amount.toFixed(2)),
                percentage: totalExpenses > 0 ? Number(((c.amount / totalExpenses) * 100).toFixed(2)) : 0,
            })),
            paymentMethodBreakdown: Array.from(pmMap.values()).map((p) => ({
                ...p,
                amount: Number(p.amount.toFixed(2)),
            })),
            dailyTrend: Array.from(dailyMap.values())
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((d) => ({ ...d, amount: Number(d.amount.toFixed(2)) })),
        };
    }
    // 6. Customer & Loyalty Report
    async getCustomerReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getCustomerReportData(filters, startDate, endDate);
        let pointsEarned = 0;
        let pointsRedeemed = 0;
        for (const lt of data.loyaltyTransactions) {
            if (lt.type === 'EARN')
                pointsEarned += Math.abs(lt.points);
            else if (lt.type === 'REDEEM')
                pointsRedeemed += Math.abs(lt.points);
        }
        let totalCustomerSpend = 0;
        const customerPerformance = [];
        for (const c of data.allCustomers) {
            const spend = c.sales.reduce((sum, s) => sum + Number(s.total), 0);
            totalCustomerSpend += spend;
            if (spend > 0 || c.sales.length > 0) {
                customerPerformance.push({
                    customerId: c.id,
                    name: c.name,
                    phone: c.phone,
                    tierName: c.tier?.name || 'STANDARD',
                    invoicesCount: c.sales.length,
                    totalSpend: Number(spend.toFixed(2)),
                    currentLoyaltyPoints: c.loyaltyAccount?.totalPoints || 0,
                });
            }
        }
        customerPerformance.sort((a, b) => b.totalSpend - a.totalSpend);
        const activeCount = data.allCustomers.filter((c) => c.isActive).length;
        const purchasingCount = customerPerformance.length;
        const averageCustomerSpend = purchasingCount > 0 ? Number((totalCustomerSpend / purchasingCount).toFixed(2)) : 0;
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const paginatedCustomers = customerPerformance.slice(skip, skip + limit);
        const pagination = getPaginationMeta(customerPerformance.length, page, limit);
        return {
            period: { from: fromStr, to: toStr },
            summary: {
                totalCustomers: data.allCustomers.length,
                activeCustomers: activeCount,
                newCustomersInPeriod: data.newCustomersCount,
                purchasingCustomersInPeriod: purchasingCount,
                averageCustomerSpend,
            },
            loyaltySummary: {
                totalPointsEarned: pointsEarned,
                totalPointsRedeemed: pointsRedeemed,
                tierDistribution: data.tiers.map((t) => ({
                    tierName: t.name,
                    customerCount: t._count.customers,
                })),
            },
            topCustomersByRevenue: paginatedCustomers,
            pagination,
        };
    }
    // 7. Staff Commission Report
    async getStaffReport(filters) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(filters.from, filters.to);
        const data = await this.repo.getStaffReportData(filters, startDate, endDate);
        const salesPerUser = new Map();
        for (const s of data.sales) {
            const entry = salesPerUser.get(s.userId) || { count: 0, amount: 0 };
            entry.count++;
            entry.amount += Number(s.total);
            salesPerUser.set(s.userId, entry);
        }
        const commPerUser = new Map();
        for (const c of data.commissionTxs) {
            const commAmt = Number(c.commissionAmount);
            const entry = commPerUser.get(c.userId) || { earned: 0, reversed: 0 };
            if (commAmt > 0) {
                entry.earned += commAmt;
            }
            else {
                entry.reversed += Math.abs(commAmt);
            }
            commPerUser.set(c.userId, entry);
        }
        let totalSalesHandled = 0;
        let totalCommissionDistributed = 0;
        const staffPerformance = [];
        for (const u of data.staffUsers) {
            const sales = salesPerUser.get(u.id) || { count: 0, amount: 0 };
            const comm = commPerUser.get(u.id) || { earned: 0, reversed: 0 };
            const netComm = Number(Math.max(0, comm.earned - comm.reversed).toFixed(2));
            totalSalesHandled += sales.amount;
            totalCommissionDistributed += netComm;
            staffPerformance.push({
                userId: u.id,
                name: u.name,
                role: u.role,
                invoicesCount: sales.count,
                totalSalesAmount: Number(sales.amount.toFixed(2)),
                commissionEarned: Number(comm.earned.toFixed(2)),
                commissionReversed: Number(comm.reversed.toFixed(2)),
                netCommission: netComm,
            });
        }
        staffPerformance.sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);
        return {
            period: { from: fromStr, to: toStr },
            summary: {
                totalStaffEvaluated: data.staffUsers.length,
                totalSalesHandled: Number(totalSalesHandled.toFixed(2)),
                totalCommissionDistributed: Number(totalCommissionDistributed.toFixed(2)),
            },
            staffPerformance,
        };
    }
    // 8. Financial Summary Report
    async getFinancialSummary(from, to) {
        const { startDate, endDate, fromStr, toStr } = parseDateRange(from, to);
        const data = await this.repo.getFinancialSummaryData(startDate, endDate);
        const grossSales = data.sales.reduce((sum, s) => sum + Number(s.total), 0);
        const returnsAndRefunds = data.returns.reduce((sum, r) => sum + Number(r.total), 0);
        const netSales = Number(Math.max(0, grossSales - returnsAndRefunds).toFixed(2));
        const receivedPurchasesCost = Number(data.purchases.reduce((sum, p) => sum + Number(p.total), 0).toFixed(2));
        const operatingExpenses = Number(data.expenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2));
        const netStaffCommissions = Number(data.commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0).toFixed(2));
        const netOperationalMovement = Number((netSales - receivedPurchasesCost - operatingExpenses - netStaffCommissions).toFixed(2));
        return {
            period: { from: fromStr, to: toStr },
            metrics: {
                grossSales: Number(grossSales.toFixed(2)),
                returnsAndRefunds: Number(returnsAndRefunds.toFixed(2)),
                netSales,
                receivedPurchasesCost,
                operatingExpenses,
                netStaffCommissions,
                netOperationalMovement,
            },
            breakdown: {
                salesVolume: data.sales.length,
                returnsVolume: data.returns.length,
                purchasesVolume: data.purchases.length,
                expensesVolume: data.expenses.length,
                commissionsVolume: data.commissions.length,
            },
        };
    }
}
export const reportsService = new ReportsService();
//# sourceMappingURL=reports.service.js.map