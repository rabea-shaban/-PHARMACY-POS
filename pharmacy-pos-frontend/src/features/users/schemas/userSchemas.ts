import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getCreateUserSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string({ message: isAr ? 'الاسم مطلوب' : 'Name is required' })
      .trim()
      .min(2, isAr ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters')
      .max(100, isAr ? 'الاسم لا يمكن أن يتجاوز 100 حرف' : 'Name cannot exceed 100 characters'),
    phone: z
      .string({ message: isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required' })
      .trim()
      .min(6, isAr ? 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل' : 'Phone must be at least 6 characters')
      .max(20, isAr ? 'رقم الهاتف لا يمكن أن يتجاوز 20 حرفاً' : 'Phone cannot exceed 20 characters'),
    email: z
      .string()
      .trim()
      .email(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format')
      .optional()
      .or(z.literal('')),
    password: z
      .string({ message: isAr ? 'كلمة المرور مطلوبة' : 'Password is required' })
      .min(8, isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters'),
    role: z.enum(['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'], {
      message: isAr ? 'يرجى اختيار الصلاحية / الدور' : 'Please select a role',
    }),
  });
}

export function getUpdateUserSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters')
      .max(100)
      .optional(),
    phone: z
      .string()
      .trim()
      .min(6, isAr ? 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل' : 'Phone must be at least 6 characters')
      .max(20)
      .optional(),
    email: z
      .string()
      .trim()
      .email(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    role: z.enum(['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT']).optional(),
    isActive: z.boolean().optional(),
  });
}

export function getResetPasswordSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    password: z
      .string({ message: isAr ? 'كلمة المرور الجديدة مطلوبة' : 'New password is required' })
      .min(8, isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters'),
    confirmPassword: z
      .string({ message: isAr ? 'تأكيد كلمة المرور مطلوب' : 'Confirm password is required' }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match',
    path: ['confirmPassword'],
  });
}

export type CreateUserFormValues = z.infer<ReturnType<typeof getCreateUserSchema>>;
export type UpdateUserFormValues = z.infer<ReturnType<typeof getUpdateUserSchema>>;
export type ResetPasswordFormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;
