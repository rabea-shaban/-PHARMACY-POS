import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getCustomerSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string({ message: isAr ? 'اسم العميل مطلوب' : 'Customer name is required' })
      .trim()
      .min(2, isAr ? 'اسم العميل يجب أن يكون حرفين على الأقل' : 'Customer name must be at least 2 characters')
      .max(100, isAr ? 'اسم العميل لا يمكن أن يتجاوز 100 حرف' : 'Customer name cannot exceed 100 characters'),
    phone: z
      .string({ message: isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required' })
      .trim()
      .min(6, isAr ? 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل' : 'Phone number must be at least 6 characters')
      .max(20, isAr ? 'رقم الهاتف لا يمكن أن يتجاوز 20 حرف' : 'Phone number cannot exceed 20 characters')
      .regex(/^[0-9+ \-()]+$/, isAr ? 'رقم الهاتف يحتوي على أحرف غير صالحة' : 'Invalid phone number format'),
    email: z
      .string()
      .trim()
      .email(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email address format')
      .optional()
      .or(z.literal(''))
      .nullable(),
    address: z.string().trim().max(255).optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, isAr ? 'تاريخ الميلاد يجب أن يكون بصيغة YYYY-MM-DD' : 'Date of birth must be YYYY-MM-DD')
      .optional()
      .or(z.literal(''))
      .nullable(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
    tierId: z.string().uuid().optional().or(z.literal('')).nullable(),
    isActive: z.boolean().optional(),
  });
}

export type CustomerFormValues = z.infer<ReturnType<typeof getCustomerSchema>>;
