import { z } from 'zod';

const expenseCategoryEnum = ['RENT', 'ELECTRICITY', 'MAINTENANCE', 'SUPPLIES', 'SALARY', 'OTHER'] as const;
const paymentMethodEnum = ['CASH', 'VISA', 'WALLET', 'OTHER'] as const;

export const expenseIdParamSchema = z.object({
  id: z.string().uuid('Expense ID must be a valid UUID'),
});

export const createExpenseSchema = z.object({
  amount: z.number({ message: 'Amount is required' }).positive('Expense amount must be greater than 0'),
  category: z.enum(expenseCategoryEnum, { message: 'Invalid expense category' }),
  description: z
    .string({ message: 'Description is required' })
    .trim()
    .min(3, 'Description must be at least 3 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  paymentMethod: z.enum(paymentMethodEnum).default('CASH'),
  expenseDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive().optional(),
  category: z.enum(expenseCategoryEnum).optional(),
  description: z.string().trim().min(3).max(500).optional(),
  paymentMethod: z.enum(paymentMethodEnum).optional(),
  expenseDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const expenseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  category: z.enum(expenseCategoryEnum).optional(),
  paymentMethod: z.enum(paymentMethodEnum).optional(),
  createdById: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['amount', 'expenseDate', 'createdAt']).default('expenseDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateExpenseDTO = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDTO = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryDTO = z.infer<typeof expenseQuerySchema>;
