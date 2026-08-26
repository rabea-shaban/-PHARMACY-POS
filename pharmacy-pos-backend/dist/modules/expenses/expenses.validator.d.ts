import { z } from 'zod';
export declare const expenseIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const createExpenseSchema: z.ZodObject<{
    amount: z.ZodNumber;
    category: z.ZodEnum<{
        RENT: "RENT";
        ELECTRICITY: "ELECTRICITY";
        MAINTENANCE: "MAINTENANCE";
        SUPPLIES: "SUPPLIES";
        SALARY: "SALARY";
        OTHER: "OTHER";
    }>;
    description: z.ZodString;
    paymentMethod: z.ZodDefault<z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>>;
    expenseDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
}, z.core.$strip>;
export declare const updateExpenseSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodEnum<{
        RENT: "RENT";
        ELECTRICITY: "ELECTRICITY";
        MAINTENANCE: "MAINTENANCE";
        SUPPLIES: "SUPPLIES";
        SALARY: "SALARY";
        OTHER: "OTHER";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>>;
    expenseDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
}, z.core.$strip>;
export declare const expenseQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
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
    createdById: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        amount: "amount";
        expenseDate: "expenseDate";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateExpenseDTO = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDTO = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryDTO = z.infer<typeof expenseQuerySchema>;
