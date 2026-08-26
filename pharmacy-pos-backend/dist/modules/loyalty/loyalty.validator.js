import { z } from 'zod';
const loyaltyTransactionTypeEnum = [
    'EARN',
    'REDEEM',
    'ADJUSTMENT',
    'EXPIRED',
    'REVERSAL',
];
export const earnPointsSchema = z.object({
    points: z
        .number({ message: 'Points value is required' })
        .int('Points must be a whole integer')
        .positive('Earn points must be greater than zero'),
    referenceType: z.string().trim().max(50).optional().nullable(),
    referenceId: z.string().trim().max(100).optional().nullable(),
    reason: z.string().trim().max(255).optional().nullable(),
});
export const redeemPointsSchema = z.object({
    points: z
        .number({ message: 'Points value is required' })
        .int('Points must be a whole integer')
        .positive('Redeem points must be greater than zero'),
    referenceType: z.string().trim().max(50).optional().nullable(),
    referenceId: z.string().trim().max(100).optional().nullable(),
    reason: z.string().trim().max(255).optional().nullable(),
});
export const adjustPointsSchema = z.object({
    points: z
        .number({ message: 'Points value is required' })
        .int('Points must be a whole integer')
        .refine((val) => val !== 0, 'Adjustment points cannot be zero'),
    reason: z
        .string({ message: 'Adjustment reason is required' })
        .trim()
        .min(3, 'Adjustment reason must be at least 3 characters')
        .max(255, 'Adjustment reason cannot exceed 255 characters'),
    referenceType: z.string().trim().max(50).optional().nullable(),
    referenceId: z.string().trim().max(100).optional().nullable(),
});
export const loyaltyTransactionQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    type: z.enum(loyaltyTransactionTypeEnum).optional(),
    sortBy: z.enum(['createdAt', 'points']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=loyalty.validator.js.map