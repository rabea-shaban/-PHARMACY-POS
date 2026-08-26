import { z } from 'zod';
export declare const returnIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const saleIdParamSchema: z.ZodObject<{
    saleId: z.ZodString;
}, z.core.$strip>;
export declare const returnItemSchema: z.ZodObject<{
    saleItemId: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const createSaleReturnSchema: z.ZodObject<{
    saleId: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        saleItemId: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const saleReturnQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    returnNumber: z.ZodOptional<z.ZodString>;
    saleId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    processedById: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        total: "total";
        returnNumber: "returnNumber";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateSaleReturnDTO = z.infer<typeof createSaleReturnSchema>;
export type SaleReturnQueryDTO = z.infer<typeof saleReturnQuerySchema>;
