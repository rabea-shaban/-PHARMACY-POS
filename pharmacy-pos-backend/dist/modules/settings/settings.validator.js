import { z } from 'zod';
export const settingKeyParamSchema = z.object({
    key: z.string().min(1, 'Setting key is required').max(100),
});
export const updateSettingsSchema = z.object({
    settings: z
        .array(z.object({
        key: z.string().min(1, 'key is required').max(100),
        value: z.string({ message: 'value is required' }),
        description: z.string().max(255).optional(),
        isPublic: z.boolean().optional(),
    }))
        .min(1, 'At least one setting must be provided'),
});
export const updateSingleSettingSchema = z.object({
    value: z.string({ message: 'value is required' }),
    description: z.string().max(255).optional(),
    isPublic: z.boolean().optional(),
});
//# sourceMappingURL=settings.validator.js.map