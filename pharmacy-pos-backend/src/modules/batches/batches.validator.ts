import { z } from 'zod';

export const batchIdParamSchema = z.object({
  id: z.string().uuid('Batch ID must be a valid UUID'),
});

export const productIdParamSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
});

export const expiringQuerySchema = z.object({
  days: z.coerce.number().int().positive().default(30),
});

export const createBatchSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
  batchNumber: z
    .string({ message: 'Batch number is required' })
    .trim()
    .min(1, 'Batch number cannot be empty')
    .max(100, 'Batch number cannot exceed 100 characters'),
  expiryDate: z
    .string({ message: 'Expiry date is required' })
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expiry date must be YYYY-MM-DD format')),
  quantity: z.number().int().min(0).default(0),
  purchasePrice: z
    .number({ message: 'Purchase price is required' })
    .min(0, 'Purchase price cannot be negative'),
  sellingPrice: z
    .number({ message: 'Selling price is required' })
    .min(0, 'Selling price cannot be negative'),
});

export const updateBatchSchema = z.object({
  expiryDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  purchasePrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
});

export const batchQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  productId: z.string().uuid().optional(),
  batchNumber: z.string().trim().optional(),
  inStockOnly: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['expiryDate', 'quantity', 'batchNumber', 'createdAt']).default('expiryDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type CreateBatchDTO = z.infer<typeof createBatchSchema>;
export type UpdateBatchDTO = z.infer<typeof updateBatchSchema>;
export type BatchQueryDTO = z.infer<typeof batchQuerySchema>;
