import { z } from 'zod';

const purchaseStatusEnum = ['PENDING', 'RECEIVED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'] as const;

export const purchaseIdParamSchema = z.object({
  id: z.string().uuid('Purchase ID must be a valid UUID'),
});

export const purchaseItemSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  discount: z.number().min(0).default(0.0),
  tax: z.number().min(0).default(0.0),
  batchNumber: z.string().trim().min(1).max(100).optional(),
  expiryDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  sellingPrice: z.number().min(0).optional(),
});

export const createPurchaseSchema = z.object({
  supplierId: z.string().uuid('Supplier ID must be a valid UUID'),
  invoiceNumber: z
    .string({ message: 'Invoice number is required' })
    .trim()
    .min(1, 'Invoice number cannot be empty')
    .max(100, 'Invoice number cannot exceed 100 characters'),
  purchaseDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  discount: z.number().min(0).default(0.0),
  tax: z.number().min(0).default(0.0),
  paidAmount: z.number().min(0).default(0.0),
  notes: z.string().trim().max(1000).optional().nullable(),
  items: z.array(purchaseItemSchema).min(1, 'Purchase must contain at least one item'),
});

export const updatePurchaseSchema = z.object({
  notes: z.string().trim().max(1000).optional().nullable(),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
});

export const receivePurchaseItemSchema = z.object({
  itemId: z.string().uuid().optional(),
  productId: z.string().uuid('Product ID must be a valid UUID'),
  batchNumber: z
    .string({ message: 'Batch number is required for receiving' })
    .trim()
    .min(1, 'Batch number cannot be empty'),
  expiryDate: z
    .string({ message: 'Expiry date is required for receiving' })
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  sellingPrice: z.number().min(0).optional(),
});

export const receivePurchaseSchema = z.object({
  items: z.array(receivePurchaseItemSchema).optional(),
});

export const cancelPurchaseSchema = z.object({
  reason: z.string().trim().min(3, 'Cancellation reason must be at least 3 characters').optional(),
});

export const purchaseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  supplierId: z.string().uuid().optional(),
  invoiceNumber: z.string().trim().optional(),
  status: z.enum(purchaseStatusEnum).optional(),
  startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  endDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  sortBy: z.enum(['purchaseDate', 'total', 'invoiceNumber', 'createdAt']).default('purchaseDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreatePurchaseDTO = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseDTO = z.infer<typeof updatePurchaseSchema>;
export type ReceivePurchaseDTO = z.infer<typeof receivePurchaseSchema>;
export type CancelPurchaseDTO = z.infer<typeof cancelPurchaseSchema>;
export type PurchaseQueryDTO = z.infer<typeof purchaseQuerySchema>;
