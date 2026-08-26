import { z } from 'zod';

export const createInsuranceProviderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'اسم شركة التأمين يجب ألا يقل عن حرفين')
    .max(150, 'اسم شركة التأمين يجب ألا يتجاوز 150 حرفاً'),
  phone: z.string().trim().max(30, 'رقم الهاتف يجب ألا يتجاوز 30 حرفاً').optional().or(z.literal('')),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة').optional().or(z.literal('')),
  address: z.string().trim().max(255, 'العنوان يجب ألا يتجاوز 255 حرفاً').optional().or(z.literal('')),
  defaultCoveragePercentage: z.coerce
    .number()
    .min(0, 'نسبة التغطية لا يمكن أن تقل عن 0%')
    .max(100, 'نسبة التغطية لا يمكن أن تزيد عن 100%')
    .default(80),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type CreateInsuranceProviderFormData = z.infer<typeof createInsuranceProviderSchema>;

export const updateInsuranceProviderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'اسم شركة التأمين يجب ألا يقل عن حرفين')
    .max(150, 'اسم شركة التأمين يجب ألا يتجاوز 150 حرفاً'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة').optional().or(z.literal('')),
  address: z.string().trim().max(255).optional().or(z.literal('')),
  defaultCoveragePercentage: z.coerce
    .number()
    .min(0, 'نسبة التغطية لا يمكن أن تقل عن 0%')
    .max(100, 'نسبة التغطية لا يمكن أن تزيد عن 100%'),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type UpdateInsuranceProviderFormData = z.infer<typeof updateInsuranceProviderSchema>;

export const createCustomerInsuranceSchema = z.object({
  customerId: z.string().uuid('معرف العميل غير صحيح'),
  insuranceProviderId: z.string().uuid('يرجى اختيار شركة التأمين'),
  policyNumber: z.string().trim().min(1, 'رقم البوليصة مطلوب').max(100),
  memberNumber: z.string().trim().min(1, 'رقم العضوية / الكارنيه مطلوب').max(100),
  coveragePercentage: z.coerce
    .number()
    .min(0, 'نسبة التغطية لا تقل عن 0%')
    .max(100, 'نسبة التغطية لا تزيد عن 100%')
    .optional(),
  maxCoverageLimit: z.coerce
    .number()
    .min(0, 'الحد الأقصى للتغطية يجب أن يكون رقماً موجباً')
    .optional()
    .nullable(),
  expiryDate: z.string().optional().nullable(),
});

export type CreateCustomerInsuranceFormData = z.infer<typeof createCustomerInsuranceSchema>;
