import { z } from 'zod';
export declare const purchaseIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const purchaseItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    unitCost: z.ZodNumber;
    discount: z.ZodDefault<z.ZodNumber>;
    tax: z.ZodDefault<z.ZodNumber>;
    batchNumber: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    sellingPrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const createPurchaseSchema: z.ZodObject<{
    supplierId: z.ZodString;
    invoiceNumber: z.ZodString;
    purchaseDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    discount: z.ZodDefault<z.ZodNumber>;
    tax: z.ZodDefault<z.ZodNumber>;
    paidAmount: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        unitCost: z.ZodNumber;
        discount: z.ZodDefault<z.ZodNumber>;
        tax: z.ZodDefault<z.ZodNumber>;
        batchNumber: z.ZodOptional<z.ZodString>;
        expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
        sellingPrice: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updatePurchaseSchema: z.ZodObject<{
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    discount: z.ZodOptional<z.ZodNumber>;
    tax: z.ZodOptional<z.ZodNumber>;
    paidAmount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const receivePurchaseItemSchema: z.ZodObject<{
    itemId: z.ZodOptional<z.ZodString>;
    productId: z.ZodString;
    batchNumber: z.ZodString;
    expiryDate: z.ZodUnion<[z.ZodString, z.ZodString]>;
    sellingPrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const receivePurchaseSchema: z.ZodObject<{
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        itemId: z.ZodOptional<z.ZodString>;
        productId: z.ZodString;
        batchNumber: z.ZodString;
        expiryDate: z.ZodUnion<[z.ZodString, z.ZodString]>;
        sellingPrice: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const cancelPurchaseSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const purchaseQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    supplierId: z.ZodOptional<z.ZodString>;
    invoiceNumber: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        PAID: "PAID";
        CANCELLED: "CANCELLED";
        RECEIVED: "RECEIVED";
        PARTIALLY_PAID: "PARTIALLY_PAID";
    }>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        invoiceNumber: "invoiceNumber";
        purchaseDate: "purchaseDate";
        total: "total";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreatePurchaseDTO = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseDTO = z.infer<typeof updatePurchaseSchema>;
export type ReceivePurchaseDTO = z.infer<typeof receivePurchaseSchema>;
export type CancelPurchaseDTO = z.infer<typeof cancelPurchaseSchema>;
export type PurchaseQueryDTO = z.infer<typeof purchaseQuerySchema>;
