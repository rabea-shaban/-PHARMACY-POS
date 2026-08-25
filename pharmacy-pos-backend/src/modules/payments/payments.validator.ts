import { z } from 'zod';

const paymentMethodEnum = ['CASH', 'VISA', 'WALLET', 'OTHER'] as const;

export const paymentIdParamSchema = z.object({
  id: z.string().uuid('Payment ID must be a valid UUID'),
});

export const saleIdParamSchema = z.object({
  saleId: z.string().uuid('Sale ID must be a valid UUID'),
});

export const paymentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  saleId: z.string().uuid().optional(),
  paymentMethod: z.enum(paymentMethodEnum).optional(),
  createdById: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['amount', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaymentQueryDTO = z.infer<typeof paymentQuerySchema>;
