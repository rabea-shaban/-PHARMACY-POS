import { z } from 'zod';

const paymentMethodEnum = ['CASH', 'VISA', 'WALLET', 'OTHER'] as const;
const expenseCategoryEnum = ['RENT', 'ELECTRICITY', 'MAINTENANCE', 'SUPPLIES', 'SALARY', 'OTHER'] as const;
const purchaseStatusEnum = ['PENDING', 'RECEIVED', 'CANCELLED'] as const;

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

export type SalesReportQueryDTO = z.infer<typeof salesReportQuerySchema>;
export type ProductReportQueryDTO = z.infer<typeof productReportQuerySchema>;
export type InventoryReportQueryDTO = z.infer<typeof inventoryReportQuerySchema>;
export type PurchaseReportQueryDTO = z.infer<typeof purchaseReportQuerySchema>;
export type ExpenseReportQueryDTO = z.infer<typeof expenseReportQuerySchema>;
export type CustomerReportQueryDTO = z.infer<typeof customerReportQuerySchema>;
export type StaffReportQueryDTO = z.infer<typeof staffReportQuerySchema>;
export type FinancialSummaryQueryDTO = z.infer<typeof financialSummaryQuerySchema>;
