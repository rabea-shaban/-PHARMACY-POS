import { z } from 'zod';
export const returnIdParamSchema = z.object({
    id: z.string().uuid('Return ID must be a valid UUID'),
});
export const saleIdParamSchema = z.object({
    saleId: z.string().uuid('Sale ID must be a valid UUID'),
});
export const returnItemSchema = z.object({
    saleItemId: z.string().uuid('Sale Item ID must be a valid UUID'),
    quantity: z.number().int().positive('Return quantity must be a positive integer'),
});
export const createSaleReturnSchema = z.object({
    saleId: z.string().uuid('Sale ID must be a valid UUID'),
    reason: z.string().trim().max(500).optional().nullable(),
    items: z.array(returnItemSchema).min(1, 'At least one item must be returned'),
});
export const saleReturnQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    returnNumber: z.string().trim().optional(),
    saleId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    processedById: z.string().uuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.enum(['returnNumber', 'total', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=sale-returns.validator.js.map