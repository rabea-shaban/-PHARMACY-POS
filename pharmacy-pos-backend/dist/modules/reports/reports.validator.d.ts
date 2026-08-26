import { z } from 'zod';
export declare const salesReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>>;
    productId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const productReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    productId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const inventoryReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const purchaseReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    supplierId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        CANCELLED: "CANCELLED";
        RECEIVED: "RECEIVED";
    }>>;
}, z.core.$strip>;
export declare const expenseReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        RENT: "RENT";
        ELECTRICITY: "ELECTRICITY";
        MAINTENANCE: "MAINTENANCE";
        SUPPLIES: "SUPPLIES";
        SALARY: "SALARY";
        OTHER: "OTHER";
    }>>;
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>>;
}, z.core.$strip>;
export declare const customerReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const staffReportQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const financialSummaryQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SalesReportQueryDTO = z.infer<typeof salesReportQuerySchema>;
export type ProductReportQueryDTO = z.infer<typeof productReportQuerySchema>;
export type InventoryReportQueryDTO = z.infer<typeof inventoryReportQuerySchema>;
export type PurchaseReportQueryDTO = z.infer<typeof purchaseReportQuerySchema>;
export type ExpenseReportQueryDTO = z.infer<typeof expenseReportQuerySchema>;
export type CustomerReportQueryDTO = z.infer<typeof customerReportQuerySchema>;
export type StaffReportQueryDTO = z.infer<typeof staffReportQuerySchema>;
export type FinancialSummaryQueryDTO = z.infer<typeof financialSummaryQuerySchema>;
