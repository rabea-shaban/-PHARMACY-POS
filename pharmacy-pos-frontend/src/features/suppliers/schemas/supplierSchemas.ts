import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getSupplierSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'اسم المورد يجب أن يكون حرفين على الأقل' : 'Supplier name must be at least 2 characters')
      .max(150, isAr ? 'اسم المورد لا يمكن أن يتجاوز 150 حرف' : 'Supplier name cannot exceed 150 characters'),
    phone: z
      .string()
      .trim()
      .min(6, isAr ? 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل' : 'Phone number must be at least 6 characters')
      .max(30, isAr ? 'رقم الهاتف لا يمكن أن يتجاوز 30 حرف' : 'Phone number cannot exceed 30 characters'),
    email: z
      .string()
      .trim()
      .email(isAr ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address')
      .optional()
      .nullable()
      .or(z.literal('')),
    address: z.string().trim().max(255).optional().nullable(),
    taxNumber: z.string().trim().max(50).optional().nullable(),
    notes: z.string().trim().max(1000).optional().nullable(),
    isActive: z.boolean().default(true),
  });
}

export type SupplierSchemaFormValues = z.infer<ReturnType<typeof getSupplierSchema>>;
