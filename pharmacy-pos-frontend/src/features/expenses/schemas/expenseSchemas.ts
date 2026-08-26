import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getExpenseSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    amount: z.coerce
      .number({ message: isAr ? 'المبلغ مطلوب' : 'Amount is required' })
      .positive(isAr ? 'المبلغ يجب أن يكون أكبر من الصفر' : 'Amount must be greater than 0'),
    category: z.enum(['RENT', 'ELECTRICITY', 'MAINTENANCE', 'SUPPLIES', 'SALARY', 'OTHER'], {
      message: isAr ? 'يرجى اختيار بند المصروف' : 'Please select an expense category',
    }),
    description: z
      .string({ message: isAr ? 'الوصف والتفاصيل مطلوبة' : 'Description is required' })
      .trim()
      .min(3, isAr ? 'الوصف يجب أن يكون 3 أحرف على الأقل' : 'Description must be at least 3 characters')
      .max(500, isAr ? 'الوصف لا يمكن أن يتجاوز 500 حرف' : 'Description cannot exceed 500 characters'),
    paymentMethod: z.enum(['CASH', 'VISA', 'WALLET', 'OTHER'], {
      message: isAr ? 'طريقة الدفع غير صالحة' : 'Invalid payment method',
    }).default('CASH'),
    expenseDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, isAr ? 'تاريخ المصروف غير صحيح' : 'Invalid expense date')
      .optional()
      .or(z.literal('')),
  });
}

export type ExpenseFormValues = z.infer<ReturnType<typeof getExpenseSchema>>;
