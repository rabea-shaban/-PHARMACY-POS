import { z } from 'zod';

const discountTypeEnum = ['PERCENTAGE', 'FIXED', 'PROMOTIONAL', 'CUSTOMER_TIER', 'MANUAL'] as const;

export const discountIdParamSchema = z.object({
  id: z.string().uuid('Discount ID must be a valid UUID'),
});

export const createDiscountSchema = z.object({
  code: z.string().trim().toUpperCase().min(2).max(50).optional().nullable(),
  name: z
    .string({ message: 'Discount name is required' })
    .trim()
    .min(2, 'Discount name must be at least 2 characters')
    .max(100, 'Discount name cannot exceed 100 characters'),
  type: z.enum(discountTypeEnum, { message: 'Invalid discount type' }),
  value: z.number({ message: 'Discount value is required' }).min(0, 'Discount value cannot be negative'),
  minimumPurchase: z.number().min(0).default(0.0),
  startDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
  endDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
});

export const updateDiscountSchema = z.object({
  code: z.string().trim().toUpperCase().min(2).max(50).optional().nullable(),
  name: z.string().trim().min(2).max(100).optional(),
  type: z.enum(discountTypeEnum).optional(),
  value: z.number().min(0).optional(),
  minimumPurchase: z.number().min(0).optional(),
  startDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
  endDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

export const discountQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  code: z.string().trim().optional(),
  type: z.enum(discountTypeEnum).optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['name', 'value', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateDiscountDTO = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountDTO = z.infer<typeof updateDiscountSchema>;
export type DiscountQueryDTO = z.infer<typeof discountQuerySchema>;
