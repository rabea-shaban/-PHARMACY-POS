import { z } from 'zod';
export declare const securityQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    userId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        FAILED: "FAILED";
        SUCCESS: "SUCCESS";
    }>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const securityStatsQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SecurityQueryDTO = z.infer<typeof securityQuerySchema>;
export type SecurityStatsQueryDTO = z.infer<typeof securityStatsQuerySchema>;
