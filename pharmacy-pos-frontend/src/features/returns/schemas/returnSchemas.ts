import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getSaleReturnSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    saleId: z.string().uuid(isAr ? 'معرف الفاتورة غير صحيح' : 'Invalid Sale ID'),
    reason: z.string().trim().max(500).optional().nullable(),
    items: z
      .array(
        z.object({
          saleItemId: z.string().uuid(),
          productName: z.string().optional(),
          quantity: z.coerce
            .number()
            .int(isAr ? 'الكمية يجب أن تكون عدداً صحيحاً' : 'Quantity must be an integer')
            .min(1, isAr ? 'الكمية المسترجعة يجب أن تكون 1 على الأقل' : 'Return quantity must be at least 1'),
          maxQuantity: z.number().min(1),
          unitPrice: z.number().min(0),
        })
      )
      .min(1, isAr ? 'يجب اختيار صنف واحد على الأقل للاسترجاع' : 'At least one item must be selected for return'),
  });
}

export type SaleReturnFormValues = z.infer<ReturnType<typeof getSaleReturnSchema>>;
