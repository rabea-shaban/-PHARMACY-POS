import { z } from 'zod';
export const securityQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    userId: z.string().uuid().optional(),
    status: z.enum(['SUCCESS', 'FAILED']).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});
export const securityStatsQuerySchema = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
});
//# sourceMappingURL=security.validator.js.map