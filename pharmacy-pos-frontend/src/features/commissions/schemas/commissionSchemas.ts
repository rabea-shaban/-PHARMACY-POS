import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getCreateCommissionRuleSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string({ message: isAr ? 'اسم قاعدة العمولة مطلوب' : 'Rule name is required' })
      .trim()
      .min(2, isAr ? 'يجب ألا يقل الاسم عن حرفين' : 'Name must be at least 2 characters')
      .max(100, isAr ? 'يجب ألا يتجاوز الاسم 100 حرف' : 'Name cannot exceed 100 characters'),
    percentage: z
      .number({ message: isAr ? 'نسبة العمولة المئوية مطلوبة' : 'Percentage is required' })
      .min(0, isAr ? 'نسبة العمولة لا يمكن أن تكون سالبة' : 'Percentage cannot be negative')
      .max(100, isAr ? 'نسبة العمولة لا يمكن أن تتجاوز 100%' : 'Percentage cannot exceed 100%'),
    fixedAmount: z
      .number()
      .min(0, isAr ? 'المبلغ الثابت لا يمكن أن يكون سالباً' : 'Fixed amount cannot be negative')
      .optional()
      .nullable(),
    effectiveDate: z.string().optional(),
  });
}

export function getUpdateCommissionRuleSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'يجب ألا يقل الاسم عن حرفين' : 'Name must be at least 2 characters')
      .max(100, isAr ? 'يجب ألا يتجاوز الاسم 100 حرف' : 'Name cannot exceed 100 characters')
      .optional(),
    percentage: z
      .number()
      .min(0, isAr ? 'نسبة العمولة لا يمكن أن تكون سالبة' : 'Percentage cannot be negative')
      .max(100, isAr ? 'نسبة العمولة لا يمكن أن تتجاوز 100%' : 'Percentage cannot exceed 100%')
      .optional(),
    fixedAmount: z
      .number()
      .min(0, isAr ? 'المبلغ الثابت لا يمكن أن يكون سالباً' : 'Fixed amount cannot be negative')
      .optional()
      .nullable(),
    isActive: z.boolean().optional(),
    effectiveDate: z.string().optional(),
  });
}

export type CreateCommissionRuleFormValues = z.infer<ReturnType<typeof getCreateCommissionRuleSchema>>;
export type UpdateCommissionRuleFormValues = z.infer<ReturnType<typeof getUpdateCommissionRuleSchema>>;
