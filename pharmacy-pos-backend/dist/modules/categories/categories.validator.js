import { z } from 'zod';
export const categoryIdParamSchema = z.object({
    id: z.string().uuid('Category ID must be a valid UUID'),
});
export const createCategorySchema = z.object({
    name: z
        .string({ message: 'Category name is required' })
        .trim()
        .min(2, 'Category name must be at least 2 characters')
        .max(100, 'Category name cannot exceed 100 characters'),
    description: z.string().trim().max(500).optional().nullable(),
});
export const updateCategorySchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).optional().nullable(),
    isActive: z.boolean().optional(),
});
export const categoryQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    isActive: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
//# sourceMappingURL=categories.validator.js.map