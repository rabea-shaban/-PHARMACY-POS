import { z } from 'zod';
export const dashboardOverviewQuerySchema = z.object({
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
});
//# sourceMappingURL=dashboard.validator.js.map