import { z } from 'zod';
export const loginSchema = z
    .object({
    phone: z.string().trim().min(6, 'Phone number must be at least 6 characters').optional(),
    email: z.string().trim().email('Invalid email address format').optional(),
    identifier: z.string().trim().min(3, 'Identifier must be at least 3 characters').optional(),
    password: z
        .string({ message: 'Password is required' })
        .min(8, 'Password must be at least 8 characters'),
})
    .refine((data) => Boolean(data.phone || data.email || data.identifier), {
    message: 'Either phone, email, or identifier must be provided',
    path: ['phone'],
});
//# sourceMappingURL=auth.validator.js.map