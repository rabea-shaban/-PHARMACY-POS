import { z } from 'zod';
export declare const transferIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const transferItemInputSchema: z.ZodObject<{
    productId: z.ZodString;
    batchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    quantity: z.ZodCoercedNumber<unknown>;
    unitCost: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const createTransferSchema: z.ZodObject<{
    fromBranchId: z.ZodString;
    toBranchId: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        batchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        quantity: z.ZodCoercedNumber<unknown>;
        unitCost: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const rejectTransferSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export declare const transferQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    fromBranchId: z.ZodOptional<z.ZodString>;
    toBranchId: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        CANCELLED: "CANCELLED";
        RECEIVED: "RECEIVED";
        COMPLETED: "COMPLETED";
        APPROVED: "APPROVED";
        IN_TRANSIT: "IN_TRANSIT";
        REJECTED: "REJECTED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        status: "status";
        transferNumber: "transferNumber";
        requestedAt: "requestedAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type TransferItemInput = z.infer<typeof transferItemInputSchema>;
export type CreateTransferDTO = z.infer<typeof createTransferSchema>;
export type RejectTransferDTO = z.infer<typeof rejectTransferSchema>;
export type TransferQueryDTO = z.infer<typeof transferQuerySchema>;
