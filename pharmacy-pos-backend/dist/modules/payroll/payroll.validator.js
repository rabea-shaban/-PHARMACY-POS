import { z } from 'zod';
const payrollStatusEnum = ['DRAFT', 'PENDING', 'PAID', 'CANCELLED'];
const paymentMethodEnum = ['CASH', 'VISA', 'WALLET', 'OTHER'];
export const payrollIdParamSchema = z.object({
    id: z.string().uuid('Payroll ID must be a valid UUID'),
});
export const employeeIdParamSchema = z.object({
    employeeId: z.string().uuid('Employee ID must be a valid UUID'),
});
export const generatePayrollSchema = z.object({
    userId: z.string().uuid('Employee User ID must be a valid UUID'),
    periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'periodStart must be in YYYY-MM-DD format'),
    periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'periodEnd must be in YYYY-MM-DD format'),
    baseSalary: z.number({ message: 'baseSalary is required' }).min(0, 'baseSalary cannot be negative'),
    bonus: z.number().min(0, 'bonus cannot be negative').default(0).optional(),
    deductions: z.number().min(0, 'deductions cannot be negative').default(0).optional(),
});
export const generatePeriodPayrollSchema = z.object({
    periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'periodStart must be in YYYY-MM-DD format'),
    periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'periodEnd must be in YYYY-MM-DD format'),
    defaultBaseSalary: z.number().min(0).optional(),
    staffSalaries: z
        .array(z.object({
        userId: z.string().uuid(),
        baseSalary: z.number().min(0),
        bonus: z.number().min(0).optional(),
        deductions: z.number().min(0).optional(),
    }))
        .optional(),
});
export const updatePayrollSchema = z.object({
    baseSalary: z.number().min(0, 'baseSalary cannot be negative').optional(),
    bonus: z.number().min(0, 'bonus cannot be negative').optional(),
    deductions: z.number().min(0, 'deductions cannot be negative').optional(),
});
export const payPayrollSchema = z.object({
    paymentMethod: z.enum(paymentMethodEnum).default('CASH'),
    notes: z.string().trim().max(500).optional(),
});
export const payrollQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    userId: z.string().uuid().optional(),
    status: z.enum(payrollStatusEnum).optional(),
    periodStart: z.string().optional(),
    periodEnd: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    sortBy: z.enum(['periodStart', 'netSalary', 'createdAt', 'status']).default('periodStart'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=payroll.validator.js.map