import { z } from 'zod';
export declare const commissionRuleIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const userIdParamSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export declare const createCommissionRuleSchema: z.ZodObject<{
    name: z.ZodString;
    percentage: z.ZodNumber;
    fixedAmount: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    effectiveDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
}, z.core.$strip>;
export declare const updateCommissionRuleSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    percentage: z.ZodOptional<z.ZodNumber>;
    fixedAmount: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    effectiveDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
}, z.core.$strip>;
export declare const commissionTransactionQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    userId: z.ZodOptional<z.ZodString>;
    saleId: z.ZodOptional<z.ZodString>;
    commissionRuleId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        commissionAmount: "commissionAmount";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateCommissionRuleDTO = z.infer<typeof createCommissionRuleSchema>;
export type UpdateCommissionRuleDTO = z.infer<typeof updateCommissionRuleSchema>;
export type CommissionTransactionQueryDTO = z.infer<typeof commissionTransactionQuerySchema>;
