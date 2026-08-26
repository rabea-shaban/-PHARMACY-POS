import { z } from 'zod';
const paymentMethodEnum = ['CASH', 'VISA', 'WALLET', 'OTHER'];
const expenseCategoryEnum = ['RENT', 'ELECTRICITY', 'MAINTENANCE', 'SUPPLIES', 'SALARY', 'OTHER'];
const purchaseStatusEnum = ['PENDING', 'RECEIVED', 'CANCELLED'];
export const salesReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    userId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    paymentMethod: z.enum(paymentMethodEnum).optional(),
    productId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
export const productReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    categoryId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
export const inventoryReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    categoryId: z.string().uuid().optional(),
});
export const purchaseReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    supplierId: z.string().uuid().optional(),
    status: z.enum(purchaseStatusEnum).optional(),
});
export const expenseReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    category: z.enum(expenseCategoryEnum).optional(),
    paymentMethod: z.enum(paymentMethodEnum).optional(),
});
export const customerReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
export const staffReportQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
    userId: z.string().uuid().optional(),
});
export const financialSummaryQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
});
//# sourceMappingURL=reports.validator.js.map