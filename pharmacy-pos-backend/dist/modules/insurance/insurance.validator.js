import { z } from 'zod';
export const insuranceProviderIdParamSchema = z.object({
    id: z.string().uuid('Insurance Provider ID must be a valid UUID'),
});
export const customerInsuranceIdParamSchema = z.object({
    id: z.string().uuid('Customer Insurance ID must be a valid UUID'),
});
export const customerIdParamSchema = z.object({
    customerId: z.string().uuid('Customer ID must be a valid UUID'),
});
export const createInsuranceProviderSchema = z.object({
    name: z
        .string({ message: 'Insurance provider name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(150, 'Name cannot exceed 150 characters'),
    phone: z.string().trim().max(30).optional().nullable(),
    email: z.string().trim().email('Invalid email address').optional().nullable(),
    address: z.string().trim().max(255).optional().nullable(),
    defaultCoveragePercentage: z.number().min(0).max(100).default(80.0),
    notes: z.string().trim().max(1000).optional().nullable(),
});
export const updateInsuranceProviderSchema = z.object({
    name: z.string().trim().min(2).max(150).optional(),
    phone: z.string().trim().max(30).optional().nullable(),
    email: z.string().trim().email().optional().nullable(),
    address: z.string().trim().max(255).optional().nullable(),
    defaultCoveragePercentage: z.number().min(0).max(100).optional(),
    notes: z.string().trim().max(1000).optional().nullable(),
    isActive: z.boolean().optional(),
});
export const createCustomerInsuranceSchema = z.object({
    customerId: z.string().uuid('Customer ID must be a valid UUID'),
    insuranceProviderId: z.string().uuid('Insurance Provider ID must be a valid UUID'),
    policyNumber: z.string().trim().min(1, 'Policy number is required').max(100),
    memberNumber: z.string().trim().min(1, 'Member number is required').max(100),
    coveragePercentage: z.number().min(0).max(100).optional(),
    maxCoverageLimit: z.number().min(0).optional().nullable(),
    expiryDate: z
        .string()
        .datetime({ offset: true })
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
        .optional()
        .nullable(),
});
export const insuranceQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    isActive: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
    sortBy: z.enum(['name', 'createdAt']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
//# sourceMappingURL=insurance.validator.js.map