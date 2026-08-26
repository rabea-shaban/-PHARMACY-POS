import { z } from 'zod';
export declare const discountIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const createDiscountSchema: z.ZodObject<{
    code: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodString;
    type: z.ZodEnum<{
        PERCENTAGE: "PERCENTAGE";
        FIXED: "FIXED";
        PROMOTIONAL: "PROMOTIONAL";
        CUSTOMER_TIER: "CUSTOMER_TIER";
        MANUAL: "MANUAL";
    }>;
    value: z.ZodNumber;
    minimumPurchase: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
}, z.core.$strip>;
export declare const updateDiscountSchema: z.ZodObject<{
    code: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        PERCENTAGE: "PERCENTAGE";
        FIXED: "FIXED";
        PROMOTIONAL: "PROMOTIONAL";
        CUSTOMER_TIER: "CUSTOMER_TIER";
        MANUAL: "MANUAL";
    }>>;
    value: z.ZodOptional<z.ZodNumber>;
    minimumPurchase: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const discountQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        PERCENTAGE: "PERCENTAGE";
        FIXED: "FIXED";
        PROMOTIONAL: "PROMOTIONAL";
        CUSTOMER_TIER: "CUSTOMER_TIER";
        MANUAL: "MANUAL";
    }>>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        name: "name";
        createdAt: "createdAt";
        value: "value";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateDiscountDTO = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountDTO = z.infer<typeof updateDiscountSchema>;
export type DiscountQueryDTO = z.infer<typeof discountQuerySchema>;
