import { z } from 'zod';
export declare const medicationIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const customerIdParamSchema: z.ZodObject<{
    customerId: z.ZodString;
}, z.core.$strip>;
export declare const createPatientMedicationSchema: z.ZodObject<{
    customerId: z.ZodString;
    productId: z.ZodString;
    saleId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    reviewDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updatePatientMedicationSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        ACUTE: "ACUTE";
        CHRONIC: "CHRONIC";
    }>>;
    dosage: z.ZodOptional<z.ZodString>;
    dosageUnit: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    frequency: z.ZodOptional<z.ZodString>;
    dosageTimes: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>>, z.ZodTransform<string | null, string | string[] | null | undefined>>;
    duration: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isContinuous: z.ZodOptional<z.ZodBoolean>;
    doctorNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    reviewDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const patientMedicationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    customerId: z.ZodOptional<z.ZodString>;
    productId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        ACUTE: "ACUTE";
        CHRONIC: "CHRONIC";
    }>>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        startDate: "startDate";
        endDate: "endDate";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreatePatientMedicationDTO = z.infer<typeof createPatientMedicationSchema>;
export type UpdatePatientMedicationDTO = z.infer<typeof updatePatientMedicationSchema>;
export type PatientMedicationQueryDTO = z.infer<typeof patientMedicationQuerySchema>;
