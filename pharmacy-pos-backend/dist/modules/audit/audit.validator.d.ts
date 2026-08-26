import { z } from 'zod';
export declare const auditIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const auditQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    userId: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodEnum<{
        CREATE: "CREATE";
        UPDATE: "UPDATE";
        DELETE: "DELETE";
        LOGIN: "LOGIN";
        SALE: "SALE";
        PAYMENT: "PAYMENT";
        RETURN: "RETURN";
        INVENTORY_ADJUSTMENT: "INVENTORY_ADJUSTMENT";
    }>>;
    entity: z.ZodOptional<z.ZodString>;
    entityId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const auditSummaryQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AuditQueryDTO = z.infer<typeof auditQuerySchema>;
export type AuditSummaryQueryDTO = z.infer<typeof auditSummaryQuerySchema>;
