import { z } from 'zod';
export declare const userIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    password: z.ZodString;
    role: z.ZodEnum<{
        PLATFORM_MANAGER: "PLATFORM_MANAGER";
        PHARMACY_MANAGER: "PHARMACY_MANAGER";
        PHARMACIST: "PHARMACIST";
        ACCOUNTANT: "ACCOUNTANT";
    }>;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        PLATFORM_MANAGER: "PLATFORM_MANAGER";
        PHARMACY_MANAGER: "PHARMACY_MANAGER";
        PHARMACIST: "PHARMACIST";
        ACCOUNTANT: "ACCOUNTANT";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const userQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        PLATFORM_MANAGER: "PLATFORM_MANAGER";
        PHARMACY_MANAGER: "PHARMACY_MANAGER";
        PHARMACIST: "PHARMACIST";
        ACCOUNTANT: "ACCOUNTANT";
    }>>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        name: "name";
        role: "role";
        createdAt: "createdAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserQueryDTO = z.infer<typeof userQuerySchema>;
