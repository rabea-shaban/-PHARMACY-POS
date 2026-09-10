import { z } from 'zod';
export declare const saleIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const checkoutItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const checkoutPaymentSchema: z.ZodObject<{
    paymentMethod: z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>;
    amount: z.ZodNumber;
    referenceNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const checkoutMedicationInstructionSchema: z.ZodObject<{
    productId: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<{
        ACUTE: "ACUTE";
        CHRONIC: "CHRONIC";
    }>>;
    dosage: z.ZodString;
    dosageUnit: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    frequency: z.ZodString;
    dosageTimes: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>>, z.ZodTransform<string | null, string | string[] | null | undefined>>;
    duration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isContinuous: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    doctorNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const checkoutRequestSchema: z.ZodObject<{
    customerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>;
    discountId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    discountCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    discountAmount: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    customerInsuranceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    redeemPoints: z.ZodDefault<z.ZodNumber>;
    payments: z.ZodArray<z.ZodObject<{
        paymentMethod: z.ZodEnum<{
            OTHER: "OTHER";
            CASH: "CASH";
            VISA: "VISA";
            WALLET: "WALLET";
        }>;
        amount: z.ZodNumber;
        referenceNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    medicationInstructions: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<{
            ACUTE: "ACUTE";
            CHRONIC: "CHRONIC";
        }>>;
        dosage: z.ZodString;
        dosageUnit: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        frequency: z.ZodString;
        dosageTimes: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>>, z.ZodTransform<string | null, string | string[] | null | undefined>>;
        duration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isContinuous: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        doctorNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const saleQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    invoiceNumber: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        PARTIALLY_RETURNED: "PARTIALLY_RETURNED";
        RETURNED: "RETURNED";
    }>>;
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        CASH: "CASH";
        VISA: "VISA";
        WALLET: "WALLET";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        invoiceNumber: "invoiceNumber";
        total: "total";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const cancelSaleSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type CheckoutRequestDTO = z.infer<typeof checkoutRequestSchema>;
export type CheckoutMedicationInstructionDTO = z.infer<typeof checkoutMedicationInstructionSchema>;
export type SaleQueryDTO = z.infer<typeof saleQuerySchema>;
export type CancelSaleDTO = z.infer<typeof cancelSaleSchema>;
