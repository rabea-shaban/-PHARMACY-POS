import { z } from 'zod';
export declare const notificationIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const notificationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    isRead: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    type: z.ZodOptional<z.ZodEnum<{
        LOW_STOCK: "LOW_STOCK";
        EXPIRY_ALERT: "EXPIRY_ALERT";
        SALE_COMPLETED: "SALE_COMPLETED";
        SYSTEM_ALERT: "SYSTEM_ALERT";
        GENERAL: "GENERAL";
    }>>;
}, z.core.$strip>;
export type NotificationQueryDTO = z.infer<typeof notificationQuerySchema>;
