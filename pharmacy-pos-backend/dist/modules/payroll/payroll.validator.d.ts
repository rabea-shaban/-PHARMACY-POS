import { z } from 'zod';
export declare const payrollIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const employeeIdParamSchema: z.ZodObject<{
    employeeId: z.ZodString;
}, z.core.$strip>;
export declare const generatePayrollSchema: z.ZodObject<{
    userId: z.ZodString;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    baseSalary: z.ZodNumber;
    bonus: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    deductions: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export declare const generatePeriodPayrollSchema: z.ZodObject<{
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    defaultBaseSalary: z.ZodOptional<z.ZodNumber>;
    staffSalaries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        baseSalary: z.ZodNumber;
        bonus: z.ZodOptional<z.ZodNumber>;
        deductions: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updatePayrollSchema: z.ZodObject<{
    baseSalary: z.ZodOptional<z.ZodNumber>;
    bonus: z.ZodOptional<z.ZodNumber>;
    deductions: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const payPayrollSchema: z.ZodObject<{
    paymentMethod: z.ZodDefault<z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const payrollQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    userId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PENDING: "PENDING";
        PAID: "PAID";
        CANCELLED: "CANCELLED";
    }>>;
    periodStart: z.ZodOptional<z.ZodString>;
    periodEnd: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        netSalary: "netSalary";
        periodStart: "periodStart";
        status: "status";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type GeneratePayrollDTO = z.infer<typeof generatePayrollSchema>;
export type GeneratePeriodPayrollDTO = z.infer<typeof generatePeriodPayrollSchema>;
export type UpdatePayrollDTO = z.infer<typeof updatePayrollSchema>;
export type PayPayrollDTO = z.infer<typeof payPayrollSchema>;
export type PayrollQueryDTO = z.infer<typeof payrollQuerySchema>;
