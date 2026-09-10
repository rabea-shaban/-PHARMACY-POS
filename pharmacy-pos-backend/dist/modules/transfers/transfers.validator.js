import { z } from 'zod';
export const transferIdParamSchema = z.object({
    id: z.string().uuid('Transfer ID must be a valid UUID'),
});
export const transferItemInputSchema = z.object({
    productId: z.string().uuid('Product ID must be a valid UUID'),
    batchId: z.string().uuid('Batch ID must be a valid UUID').optional().nullable(),
    quantity: z.coerce.number().int().positive('Quantity must be greater than 0'),
    unitCost: z.coerce.number().min(0).optional().default(0),
    notes: z.string().trim().max(500).optional().nullable(),
});
export const createTransferSchema = z
    .object({
    fromBranchId: z.string().uuid('Source branch ID must be a valid UUID'),
    toBranchId: z.string().uuid('Destination branch ID must be a valid UUID'),
    notes: z.string().trim().max(1000).optional().nullable(),
    items: z.array(transferItemInputSchema).min(1, 'Transfer request must contain at least one item'),
})
    .refine((data) => data.fromBranchId !== data.toBranchId, {
    message: 'Source branch and destination branch must be different',
    path: ['toBranchId'],
});
export const rejectTransferSchema = z.object({
    reason: z.string().trim().min(2, 'Rejection reason is required').max(500),
});
export const transferQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    fromBranchId: z.string().uuid().optional(),
    toBranchId: z.string().uuid().optional(),
    branchId: z.string().uuid().optional(), // Either from or to
    status: z
        .enum(['PENDING', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'COMPLETED', 'REJECTED', 'CANCELLED'])
        .optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(['transferNumber', 'requestedAt', 'createdAt', 'status']).default('requestedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=transfers.validator.js.map