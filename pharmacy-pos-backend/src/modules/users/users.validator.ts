import { z } from 'zod';

const roleEnumValues = ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'] as const;

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID format (must be a valid UUID)'),
});

export const createUserSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  phone: z
    .string({ message: 'Phone number is required' })
    .trim()
    .min(6, 'Phone number must be at least 6 characters')
    .max(20, 'Phone number cannot exceed 20 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .optional()
    .or(z.literal('')),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
  role: z.enum(roleEnumValues, {
    message: 'Role must be one of: PLATFORM_MANAGER, PHARMACY_MANAGER, PHARMACIST, ACCOUNTANT',
  }),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().trim().min(6).max(20).optional(),
  email: z.string().trim().email('Invalid email format').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(roleEnumValues).optional(),
  isActive: z.boolean().optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  role: z.enum(roleEnumValues).optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sortBy: z.enum(['name', 'createdAt', 'role']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserQueryDTO = z.infer<typeof userQuerySchema>;
