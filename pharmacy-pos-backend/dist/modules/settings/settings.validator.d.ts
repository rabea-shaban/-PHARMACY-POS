import { z } from 'zod';
export declare const settingKeyParamSchema: z.ZodObject<{
    key: z.ZodString;
}, z.core.$strip>;
export declare const updateSettingsSchema: z.ZodObject<{
    settings: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        isPublic: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateSingleSettingSchema: z.ZodObject<{
    value: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateSettingsDTO = z.infer<typeof updateSettingsSchema>;
export type UpdateSingleSettingDTO = z.infer<typeof updateSingleSettingSchema>;
