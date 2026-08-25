import { z } from 'zod';

export const commissionRuleIdParamSchema = z.object({
  id: z.string().uuid('Commission Rule ID must be a valid UUID'),
});

export const userIdParamSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
});

export const createCommissionRuleSchema = z.object({
  name: z
    .string({ message: 'Commission rule name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  percentage: z.number({ message: 'Percentage is required' }).min(0).max(100),
  fixedAmount: z.number().min(0).optional().nullable(),
  effectiveDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const updateCommissionRuleSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  percentage: z.number().min(0).max(100).optional(),
  fixedAmount: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
  effectiveDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const commissionTransactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.string().uuid().optional(),
  saleId: z.string().uuid().optional(),
  commissionRuleId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['commissionAmount', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateCommissionRuleDTO = z.infer<typeof createCommissionRuleSchema>;
export type UpdateCommissionRuleDTO = z.infer<typeof updateCommissionRuleSchema>;
export type CommissionTransactionQueryDTO = z.infer<typeof commissionTransactionQuerySchema>;
