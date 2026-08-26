import { z } from 'zod';
export declare const earnPointsSchema: z.ZodObject<{
    points: z.ZodNumber;
    referenceType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const redeemPointsSchema: z.ZodObject<{
    points: z.ZodNumber;
    referenceType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const adjustPointsSchema: z.ZodObject<{
    points: z.ZodNumber;
    reason: z.ZodString;
    referenceType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const loyaltyTransactionQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    type: z.ZodOptional<z.ZodEnum<{
        ADJUSTMENT: "ADJUSTMENT";
        EXPIRED: "EXPIRED";
        EARN: "EARN";
        REDEEM: "REDEEM";
        REVERSAL: "REVERSAL";
    }>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        points: "points";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type EarnPointsDTO = z.infer<typeof earnPointsSchema>;
export type RedeemPointsDTO = z.infer<typeof redeemPointsSchema>;
export type AdjustPointsDTO = z.infer<typeof adjustPointsSchema>;
export type LoyaltyTransactionQueryDTO = z.infer<typeof loyaltyTransactionQuerySchema>;
