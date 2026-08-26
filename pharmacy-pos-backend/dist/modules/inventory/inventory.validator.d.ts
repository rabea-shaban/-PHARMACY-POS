import { z } from 'zod';
export declare const productIdParamSchema: z.ZodObject<{
    productId: z.ZodString;
}, z.core.$strip>;
export declare const batchIdParamSchema: z.ZodObject<{
    batchId: z.ZodString;
}, z.core.$strip>;
export declare const stockAdjustmentSchema: z.ZodObject<{
    productId: z.ZodString;
    batchId: z.ZodString;
    quantity: z.ZodNumber;
    type: z.ZodEnum<{
        SALE: "SALE";
        PURCHASE: "PURCHASE";
        SALE_RETURN: "SALE_RETURN";
        PURCHASE_RETURN: "PURCHASE_RETURN";
        ADJUSTMENT: "ADJUSTMENT";
        DAMAGE: "DAMAGE";
        EXPIRED: "EXPIRED";
        MANUAL_IN: "MANUAL_IN";
        MANUAL_OUT: "MANUAL_OUT";
    }>;
    reason: z.ZodString;
    referenceType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const inventoryTransactionQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    productId: z.ZodOptional<z.ZodString>;
    batchId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        SALE: "SALE";
        PURCHASE: "PURCHASE";
        SALE_RETURN: "SALE_RETURN";
        PURCHASE_RETURN: "PURCHASE_RETURN";
        ADJUSTMENT: "ADJUSTMENT";
        DAMAGE: "DAMAGE";
        EXPIRED: "EXPIRED";
        MANUAL_IN: "MANUAL_IN";
        MANUAL_OUT: "MANUAL_OUT";
    }>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        quantity: "quantity";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type StockAdjustmentDTO = z.infer<typeof stockAdjustmentSchema>;
export type InventoryTransactionQueryDTO = z.infer<typeof inventoryTransactionQuerySchema>;
