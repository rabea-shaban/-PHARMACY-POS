import { z } from 'zod';
export declare const batchIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const productIdParamSchema: z.ZodObject<{
    productId: z.ZodString;
}, z.core.$strip>;
export declare const expiringQuerySchema: z.ZodObject<{
    days: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const createBatchSchema: z.ZodObject<{
    productId: z.ZodString;
    batchNumber: z.ZodString;
    expiryDate: z.ZodUnion<[z.ZodString, z.ZodString]>;
    quantity: z.ZodDefault<z.ZodNumber>;
    purchasePrice: z.ZodNumber;
    sellingPrice: z.ZodNumber;
}, z.core.$strip>;
export declare const updateBatchSchema: z.ZodObject<{
    expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    purchasePrice: z.ZodOptional<z.ZodNumber>;
    sellingPrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const batchQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    productId: z.ZodOptional<z.ZodString>;
    batchNumber: z.ZodOptional<z.ZodString>;
    inStockOnly: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        quantity: "quantity";
        expiryDate: "expiryDate";
        batchNumber: "batchNumber";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateBatchDTO = z.infer<typeof createBatchSchema>;
export type UpdateBatchDTO = z.infer<typeof updateBatchSchema>;
export type BatchQueryDTO = z.infer<typeof batchQuerySchema>;
