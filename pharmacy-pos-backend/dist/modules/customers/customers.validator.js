import { z } from 'zod';
const genderEnumValues = ['MALE', 'FEMALE', 'OTHER'];
export const customerIdParamSchema = z.object({
    id: z.string().uuid('Customer ID must be a valid UUID'),
});
export const createCustomerSchema = z.object({
    name: z
        .string({ message: 'Customer name is required' })
        .trim()
        .min(2, 'Customer name must be at least 2 characters')
        .max(100, 'Customer name cannot exceed 100 characters'),
    phone: z
        .string({ message: 'Customer phone number is required' })
        .trim()
        .min(6, 'Phone number must be at least 6 characters')
        .max(20, 'Phone number cannot exceed 20 characters')
        .regex(/^[0-9+ \-()]+$/, 'Invalid phone number characters'),
    email: z
        .string()
        .trim()
        .email('Invalid email address format')
        .optional()
        .or(z.literal(''))
        .nullable(),
    address: z.string().trim().max(255).optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
    dateOfBirth: z
        .string()
        .datetime({ offset: true })
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD format'))
        .optional()
        .nullable(),
    gender: z.enum(genderEnumValues, {
        message: 'Gender must be one of: MALE, FEMALE, OTHER',
    }).optional().nullable(),
    tierId: z.string().uuid('Tier ID must be a valid UUID').optional().nullable(),
});
export const updateCustomerSchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().min(6).max(20).regex(/^[0-9+ \-()]+$/).optional(),
    email: z.string().trim().email('Invalid email address format').optional().or(z.literal('')).nullable(),
    address: z.string().trim().max(255).optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
    dateOfBirth: z
        .string()
        .datetime({ offset: true })
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD format'))
        .optional()
        .nullable(),
    gender: z.enum(genderEnumValues).optional().nullable(),
    tierId: z.string().uuid('Tier ID must be a valid UUID').optional().nullable(),
    isActive: z.boolean().optional(),
});
export const customerQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    name: z.string().trim().optional(),
    tierId: z.string().uuid().optional(),
    isActive: z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
    sortBy: z.enum(['name', 'phone', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export const customerPurchasesQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
//# sourceMappingURL=customers.validator.js.map