import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import {
  SalesReportQueryFilters,
  ProductReportQueryFilters,
  InventoryReportQueryFilters,
  PurchaseReportQueryFilters,
  ExpenseReportQueryFilters,
  CustomerReportQueryFilters,
  StaffReportQueryFilters,
} from './reports.types.js';

export class ReportsRepository {
  // 1. Sales Report Data
  async getSalesReportData(filters: SalesReportQueryFilters, startDate: Date, endDate: Date) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.SaleWhereInput = {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' },
    };

    if (filters.userId) where.userId = filters.userId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.paymentMethod) {
      where.payments = { some: { paymentMethod: filters.paymentMethod } };
    }
    if (filters.productId || filters.categoryId) {
      where.items = {
        some: {
          ...(filters.productId ? { productId: filters.productId } : {}),
          ...(filters.categoryId ? { product: { categoryId: filters.categoryId } } : {}),
        },
      };
    }

    const [allMatchingSales, totalInvoicesCount, paginatedSales, allReturns, allPayments] = await Promise.all([
      // Complete set of sales matching filter in period for analytics
      prisma.sale.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  barcode: true,
                  categoryId: true,
                  category: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      }),

      // Count for pagination
      prisma.sale.count({ where }),

      // Paginated detailed invoices
      prisma.sale.findMany({
        where,
        include: {
          user: { select: { name: true } },
          customer: { select: { name: true } },
          items: { select: { id: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      // Returns in period
      prisma.saleReturn.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.customerId ? { customerId: filters.customerId } : {}),
        },
      }),

      // Payments in period
      prisma.payment.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          sale: { status: { not: 'CANCELLED' } },
        },
      }),
    ]);

    return {
      allMatchingSales,
      totalInvoicesCount,
      paginatedSales,
      allReturns,
      allPayments,
    };
  }

  // 2. Product Performance Data
  async getProductPerformanceData(filters: ProductReportQueryFilters, startDate: Date, endDate: Date) {
    const whereProduct: Prisma.ProductWhereInput = {
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.productId ? { id: filters.productId } : {}),
    };

    const [products, saleItems, returnItems] = await Promise.all([
      // Products with category and batches
      prisma.product.findMany({
        where: whereProduct,
        include: {
          category: { select: { name: true } },
          batches: { select: { quantity: true, expiryDate: true } },
        },
        orderBy: { name: 'asc' },
      }),

      // Sale items sold in period
      prisma.saleItem.findMany({
        where: {
          sale: {
            createdAt: { gte: startDate, lte: endDate },
            status: { not: 'CANCELLED' },
          },
          ...(filters.categoryId ? { product: { categoryId: filters.categoryId } } : {}),
          ...(filters.productId ? { productId: filters.productId } : {}),
        },
        include: {
          sale: { select: { createdAt: true } },
        },
      }),

      // Returned items in period
      prisma.saleReturnItem.findMany({
        where: {
          saleReturn: {
            createdAt: { gte: startDate, lte: endDate },
          },
          ...(filters.categoryId ? { product: { categoryId: filters.categoryId } } : {}),
          ...(filters.productId ? { productId: filters.productId } : {}),
        },
      }),
    ]);

    return { products, saleItems, returnItems };
  }

  // 3. Inventory Report Data
  async getInventoryReportData(filters: InventoryReportQueryFilters, startDate: Date, endDate: Date) {
    const whereProduct: Prisma.ProductWhereInput = {
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    };

    const [products, activeBatches, inventoryTransactions] = await Promise.all([
      prisma.product.findMany({
        where: whereProduct,
        include: {
          category: { select: { name: true } },
          batches: {
            select: { id: true, quantity: true, purchasePrice: true, sellingPrice: true, expiryDate: true },
          },
        },
      }),

      prisma.batch.findMany({
        where: {
          quantity: { gt: 0 },
          product: whereProduct,
        },
        select: {
          id: true,
          quantity: true,
          purchasePrice: true,
          sellingPrice: true,
          expiryDate: true,
        },
      }),

      prisma.inventoryTransaction.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          product: whereProduct,
        },
        select: {
          type: true,
          quantity: true,
        },
      }),
    ]);

    return { products, activeBatches, inventoryTransactions };
  }

  // 4. Purchase Report Data
  async getPurchaseReportData(filters: PurchaseReportQueryFilters, startDate: Date, endDate: Date) {
    const where: Prisma.PurchaseWhereInput = {
      createdAt: { gte: startDate, lte: endDate },
      ...(filters.supplierId ? { supplierId: filters.supplierId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        supplier: { select: { id: true, name: true, phone: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { purchases };
  }

  // 5. Expense Report Data
  async getExpenseReportData(filters: ExpenseReportQueryFilters, startDate: Date, endDate: Date) {
    const where: Prisma.ExpenseWhereInput = {
      expenseDate: { gte: startDate, lte: endDate },
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.paymentMethod ? { paymentMethod: filters.paymentMethod } : {}),
    };

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { expenseDate: 'desc' },
    });

    return { expenses };
  }

  // 6. Customer Report Data
  async getCustomerReportData(_filters: CustomerReportQueryFilters, startDate: Date, endDate: Date) {
    const [allCustomers, newCustomersCount, loyaltyTransactions, tiers] = await Promise.all([
      prisma.customer.findMany({
        include: {
          tier: { select: { name: true } },
          loyaltyAccount: { select: { totalPoints: true } },
          sales: {
            where: {
              createdAt: { gte: startDate, lte: endDate },
              status: { not: 'CANCELLED' },
            },
            select: { id: true, total: true },
          },
        },
        orderBy: { name: 'asc' },
      }),

      prisma.customer.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),

      prisma.loyaltyTransaction.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { type: true, points: true },
      }),

      prisma.customerTier.findMany({
        include: { _count: { select: { customers: true } } },
      }),
    ]);

    return { allCustomers, newCustomersCount, loyaltyTransactions, tiers };
  }

  // 7. Staff Commission Report Data
  async getStaffReportData(filters: StaffReportQueryFilters, startDate: Date, endDate: Date) {
    const whereUser: Prisma.UserWhereInput = {
      ...(filters.userId ? { id: filters.userId } : {}),
    };

    const [staffUsers, sales, commissionTxs] = await Promise.all([
      prisma.user.findMany({
        where: whereUser,
        select: { id: true, name: true, role: true },
      }),

      prisma.sale.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { not: 'CANCELLED' },
          ...(filters.userId ? { userId: filters.userId } : {}),
        },
        select: { id: true, userId: true, total: true },
      }),

      prisma.commissionTransaction.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.userId ? { userId: filters.userId } : {}),
        },
        select: { id: true, userId: true, salesAmount: true, commissionAmount: true },
      }),
    ]);

    return { staffUsers, sales, commissionTxs };
  }

  // 8. Financial Summary Data
  async getFinancialSummaryData(startDate: Date, endDate: Date) {
    const [sales, returns, purchases, expenses, commissions] = await Promise.all([
      prisma.sale.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: { not: 'CANCELLED' },
        },
        select: { total: true },
      }),

      prisma.saleReturn.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { total: true },
      }),

      prisma.purchase.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'RECEIVED',
        },
        select: { total: true },
      }),

      prisma.expense.findMany({
        where: {
          expenseDate: { gte: startDate, lte: endDate },
        },
        select: { amount: true },
      }),

      prisma.commissionTransaction.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        select: { commissionAmount: true },
      }),
    ]);

    return { sales, returns, purchases, expenses, commissions };
  }
}

export const reportsRepository = new ReportsRepository();
