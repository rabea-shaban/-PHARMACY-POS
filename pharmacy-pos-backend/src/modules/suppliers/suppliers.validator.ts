import { z } from 'zod';

export const supplierIdParamSchema = z.object({
  id: z.string().uuid('Supplier ID must be a valid UUID'),
});

export const createSupplierSchema = z.object({
  name: z
    .string({ message: 'Supplier name is required' })
    .trim()
    .min(2, 'Supplier name must be at least 2 characters')
    .max(150, 'Supplier name cannot exceed 150 characters'),
  phone: z
    .string({ message: 'Phone number is required' })
    .trim()
    .min(6, 'Phone number must be at least 6 characters')
    .max(30, 'Phone number cannot exceed 30 characters'),
  email: z.string().trim().email('Invalid email address').optional().nullable(),
  address: z.string().trim().max(255).optional().nullable(),
  taxNumber: z.string().trim().max(50).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const updateSupplierSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  phone: z.string().trim().min(6).max(30).optional(),
  email: z.string().trim().email('Invalid email address').optional().nullable(),
  address: z.string().trim().max(255).optional().nullable(),
  taxNumber: z.string().trim().max(50).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const supplierQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['name', 'phone', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierDTO = z.infer<typeof updateSupplierSchema>;
export type SupplierQueryDTO = z.infer<typeof supplierQuerySchema>;
