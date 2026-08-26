import { z } from 'zod';
export declare const insuranceProviderIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const customerInsuranceIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const customerIdParamSchema: z.ZodObject<{
    customerId: z.ZodString;
}, z.core.$strip>;
export declare const createInsuranceProviderSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    defaultCoveragePercentage: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateInsuranceProviderSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    defaultCoveragePercentage: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const createCustomerInsuranceSchema: z.ZodObject<{
    customerId: z.ZodString;
    insuranceProviderId: z.ZodString;
    policyNumber: z.ZodString;
    memberNumber: z.ZodString;
    coveragePercentage: z.ZodOptional<z.ZodNumber>;
    maxCoverageLimit: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    expiryDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
}, z.core.$strip>;
export declare const insuranceQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        name: "name";
        createdAt: "createdAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateInsuranceProviderDTO = z.infer<typeof createInsuranceProviderSchema>;
export type UpdateInsuranceProviderDTO = z.infer<typeof updateInsuranceProviderSchema>;
export type CreateCustomerInsuranceDTO = z.infer<typeof createCustomerInsuranceSchema>;
export type InsuranceQueryDTO = z.infer<typeof insuranceQuerySchema>;
