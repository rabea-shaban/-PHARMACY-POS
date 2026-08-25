import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getLoginSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    identifier: z
      .string()
      .trim()
      .min(
        1,
        isAr
          ? 'رقم الهاتف أو البريد الإلكتروني مطلوب'
          : 'Phone number or email is required'
      )
      .min(
        3,
        isAr
          ? 'يجب ألا يقل المعرف عن 3 أحرف'
          : 'Identifier must be at least 3 characters'
      ),
    password: z
      .string()
      .min(
        1,
        isAr
          ? 'كلمة المرور مطلوبة'
          : 'Password is required'
      )
      .min(
        6,
        isAr
          ? 'يجب ألا تقل كلمة المرور عن 6 أحرف'
          : 'Password must be at least 6 characters'
      ),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
