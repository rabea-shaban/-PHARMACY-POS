import { z } from 'zod';

export const pharmacyProfileSchema = z.object({
  pharmacy_name: z.string().min(2, 'اسم الصيدلية يجب أن يكون حرفين على الأقل').max(100),
  pharmacy_phone: z.string().min(6, 'رقم هاتف الصيدلية مطلوب').max(30),
  pharmacy_address: z.string().min(3, 'عنوان الصيدلية مطلوب').max(200),
  pharmacy_license: z.string().max(100).optional(),
  pharmacy_tax_number: z.string().max(100).optional(),
  pharmacy_email: z.string().email('بريد إلكتروني غير صالح').or(z.literal('')).optional(),
  pharmacy_slogan: z.string().max(150).optional(),
  pharmacy_logo: z.string().optional(),
});

export const taxSettingsSchema = z.object({
  tax_rate: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: 'نسبة الضريبة يجب أن تكون رقماً بين 0 و 100%',
    }),
  tax_enabled: z.enum(['true', 'false']),
  tax_number: z.string().max(100).optional(),
  tax_inclusive: z.enum(['true', 'false']),
});

export const invoiceReceiptSettingsSchema = z.object({
  invoice_prefix: z.string().min(1, 'بادئة الفاتورة مطلوبة').max(10),
  receipt_width: z.enum(['80mm', '58mm']),
  receipt_footer_text: z.string().max(255).optional(),
  receipt_return_policy: z.string().max(255).optional(),
  receipt_show_tax: z.enum(['true', 'false']),
  receipt_show_logo: z.enum(['true', 'false']),
});

export const generalOperationsSchema = z.object({
  currency: z.string().min(1, 'العملة مطلوبة').max(10),
  low_stock_threshold: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'حد التنبيه يجب أن يكون رقماً موجباً',
    }),
  expiry_alert_days: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: 'أيام التنبيه يجب أن تكون يوماً واحداً على الأقل',
    }),
  commission_default_rate: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: 'النسبة الافتراضية للعمولة يجب أن تكون بين 0 و 100%',
    }),
  loyalty_points_per_egp: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'معدل اكتساب النقاط يجب أن يكون رقماً موجباً',
    }),
  loyalty_point_value: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'قيمة استبدال النقطة يجب أن تكون رقماً موجباً',
    }),
});

export type PharmacyProfileFormData = z.infer<typeof pharmacyProfileSchema>;
export type TaxSettingsFormData = z.infer<typeof taxSettingsSchema>;
export type InvoiceReceiptSettingsFormData = z.infer<typeof invoiceReceiptSettingsSchema>;
export type GeneralOperationsFormData = z.infer<typeof generalOperationsSchema>;
