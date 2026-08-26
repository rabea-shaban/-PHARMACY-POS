import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    identifier: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginDTO = z.infer<typeof loginSchema>;
