import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getGeneratePayrollSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    userId: z
      .string({ message: isAr ? 'يرجى اختيار الموظف' : 'Employee is required' })
      .uuid(isAr ? 'معرف الموظف غير صالح' : 'Invalid employee UUID'),
    periodStart: z
      .string({ message: isAr ? 'تاريخ بداية الفترة مطلوب' : 'Period start date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, isAr ? 'صيغة التاريخ غير صحيحة (YYYY-MM-DD)' : 'Invalid date format (YYYY-MM-DD)'),
    periodEnd: z
      .string({ message: isAr ? 'تاريخ نهاية الفترة مطلوب' : 'Period end date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, isAr ? 'صيغة التاريخ غير صحيحة (YYYY-MM-DD)' : 'Invalid date format (YYYY-MM-DD)'),
    baseSalary: z
      .number({ message: isAr ? 'الراتب الأساسي مطلوب' : 'Base salary is required' })
      .min(0, isAr ? 'الراتب الأساسي لا يمكن أن يكون سالباً' : 'Base salary cannot be negative'),
    bonus: z
      .number()
      .min(0, isAr ? 'المكافأة لا يمكن أن تكون سالبة' : 'Bonus cannot be negative')
      .default(0),
    deductions: z
      .number()
      .min(0, isAr ? 'الاستقطاعات لا يمكن أن تكون سالبة' : 'Deductions cannot be negative')
      .default(0),
  });
}

export function getGeneratePeriodPayrollSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    periodStart: z
      .string({ message: isAr ? 'تاريخ بداية الفترة مطلوب' : 'Period start date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, isAr ? 'صيغة التاريخ غير صحيحة (YYYY-MM-DD)' : 'Invalid date format (YYYY-MM-DD)'),
    periodEnd: z
      .string({ message: isAr ? 'تاريخ نهاية الفترة مطلوب' : 'Period end date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, isAr ? 'صيغة التاريخ غير صحيحة (YYYY-MM-DD)' : 'Invalid date format (YYYY-MM-DD)'),
    defaultBaseSalary: z
      .number()
      .min(0, isAr ? 'الراتب الأساسي الافتراضي لا يمكن أن يكون سالباً' : 'Default base salary cannot be negative')
      .optional(),
  });
}

export function getUpdatePayrollSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    baseSalary: z
      .number()
      .min(0, isAr ? 'الراتب الأساسي لا يمكن أن يكون سالباً' : 'Base salary cannot be negative')
      .optional(),
    bonus: z
      .number()
      .min(0, isAr ? 'المكافأة لا يمكن أن تكون سالبة' : 'Bonus cannot be negative')
      .optional(),
    deductions: z
      .number()
      .min(0, isAr ? 'الاستقطاعات لا يمكن أن تكون سالبة' : 'Deductions cannot be negative')
      .optional(),
  });
}

export function getPayPayrollSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    paymentMethod: z.enum(['CASH', 'VISA', 'WALLET', 'OTHER'], {
      message: isAr ? 'يرجى اختيار طريقة الدفع' : 'Please select payment method',
    }),
    notes: z
      .string()
      .max(500, isAr ? 'الملاحظات لا يمكن أن تتجاوز 500 حرف' : 'Notes cannot exceed 500 characters')
      .optional(),
  });
}

export type GeneratePayrollFormValues = z.infer<ReturnType<typeof getGeneratePayrollSchema>>;
export type GeneratePeriodPayrollFormValues = z.infer<ReturnType<typeof getGeneratePeriodPayrollSchema>>;
export type UpdatePayrollFormValues = z.infer<ReturnType<typeof getUpdatePayrollSchema>>;
export type PayPayrollFormValues = z.infer<ReturnType<typeof getPayPayrollSchema>>;
