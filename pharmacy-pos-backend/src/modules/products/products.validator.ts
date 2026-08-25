import { z } from 'zod';

export const productIdParamSchema = z.object({
  id: z.string().uuid('Product ID must be a valid UUID'),
});

export const barcodeParamSchema = z.object({
  barcode: z.string().trim().min(1, 'Barcode is required'),
});

export const expiringQuerySchema = z.object({
  days: z.coerce.number().int().positive().default(30),
});

export const createProductSchema = z.object({
  name: z
    .string({ message: 'Product name is required' })
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name cannot exceed 200 characters'),
  barcode: z
    .string({ message: 'Barcode is required' })
    .trim()
    .min(1, 'Barcode cannot be empty')
    .max(100, 'Barcode cannot exceed 100 characters'),
  scientificName: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  purchasePrice: z
    .number({ message: 'Purchase price is required' })
    .min(0, 'Purchase price cannot be negative'),
  sellingPrice: z
    .number({ message: 'Selling price is required' })
    .min(0, 'Selling price cannot be negative'),
  taxRate: z.number().min(0).max(100).default(0.0),
  minimumStock: z.number().int().min(0).default(5),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  barcode: z.string().trim().min(1).max(100).optional(),
  scientificName: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
  categoryId: z.string().uuid('Category ID must be a valid UUID').optional(),
  purchasePrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  minimumStock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  lowStock: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['name', 'barcode', 'sellingPrice', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const productSearchQuerySchema = z.object({
  q: z.string().trim().optional(),
  name: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  categoryId: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type ProductQueryDTO = z.infer<typeof productQuerySchema>;
export type ProductSearchQueryDTO = z.infer<typeof productSearchQuerySchema>;
export type ExpiringQueryDTO = z.infer<typeof expiringQuerySchema>;
