import { z } from 'zod';
export declare const dashboardOverviewQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DashboardOverviewQueryDTO = z.infer<typeof dashboardOverviewQuerySchema>;
