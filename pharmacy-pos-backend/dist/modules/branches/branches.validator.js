import { z } from 'zod';
export const branchIdParamSchema = z.object({
    id: z.string().uuid('Branch ID must be a valid UUID'),
});
export const createBranchSchema = z.object({
    name: z
        .string({ message: 'Branch name is required' })
        .trim()
        .min(2, 'Branch name must be at least 2 characters')
        .max(100, 'Branch name cannot exceed 100 characters'),
    code: z
        .string({ message: 'Branch code is required' })
        .trim()
        .min(2, 'Branch code must be at least 2 characters')
        .max(20, 'Branch code cannot exceed 20 characters')
        .toUpperCase(),
    address: z.string().trim().max(255).optional().nullable(),
    phone: z.string().trim().max(50).optional().nullable(),
    isMain: z.boolean().optional().default(false),
});
export const updateBranchSchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    code: z.string().trim().min(2).max(20).toUpperCase().optional(),
    address: z.string().trim().max(255).optional().nullable(),
    phone: z.string().trim().max(50).optional().nullable(),
    isMain: z.boolean().optional(),
    isActive: z.boolean().optional(),
});
export const branchQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    isActive: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
    isMain: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
    sortBy: z.enum(['name', 'code', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=branches.validator.js.map