import { z } from 'zod';

const inventoryTransactionTypeEnum = [
  'PURCHASE',
  'SALE',
  'SALE_RETURN',
  'PURCHASE_RETURN',
  'ADJUSTMENT',
  'DAMAGE',
  'EXPIRED',
  'MANUAL_IN',
  'MANUAL_OUT',
] as const;

export const productIdParamSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
});

export const batchIdParamSchema = z.object({
  batchId: z.string().uuid('Batch ID must be a valid UUID'),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
  batchId: z.string().uuid('Batch ID must be a valid UUID'),
  quantity: z
    .number({ message: 'Quantity is required' })
    .int('Quantity must be an integer')
    .refine((val) => val !== 0, 'Adjustment quantity cannot be zero'),
  type: z.enum(inventoryTransactionTypeEnum, {
    message: 'Invalid inventory transaction type',
  }),
  reason: z
    .string({ message: 'Adjustment reason is required' })
    .trim()
    .min(3, 'Reason must be at least 3 characters')
    .max(255, 'Reason cannot exceed 255 characters'),
  referenceType: z.string().trim().max(50).optional().nullable(),
  referenceId: z.string().trim().max(100).optional().nullable(),
});

export const inventoryTransactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  productId: z.string().uuid().optional(),
  batchId: z.string().uuid().optional(),
  type: z.enum(inventoryTransactionTypeEnum).optional(),
  startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  endDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  sortBy: z.enum(['createdAt', 'quantity']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type StockAdjustmentDTO = z.infer<typeof stockAdjustmentSchema>;
export type InventoryTransactionQueryDTO = z.infer<typeof inventoryTransactionQuerySchema>;
