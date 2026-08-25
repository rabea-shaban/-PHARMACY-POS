import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getProductSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'اسم الدواء يجب أن يكون حرفين على الأقل' : 'Product name must be at least 2 characters')
      .max(200, isAr ? 'اسم الدواء لا يمكن أن يتجاوز 200 حرف' : 'Product name cannot exceed 200 characters'),
    barcode: z
      .string()
      .trim()
      .min(1, isAr ? 'الباركود مطلوب' : 'Barcode is required')
      .max(100, isAr ? 'الباركود لا يمكن أن يتجاوز 100 حرف' : 'Barcode cannot exceed 100 characters'),
    scientificName: z.string().trim().max(200).optional().nullable(),
    description: z.string().trim().max(1000).optional().nullable(),
    categoryId: z
      .string()
      .uuid(isAr ? 'يرجى اختيار تصنيف صالح' : 'Please select a valid category'),
    purchasePrice: z.coerce
      .number({ message: isAr ? 'سعر الشراء مطلوب' : 'Purchase price is required' })
      .min(0, isAr ? 'سعر الشراء لا يمكن أن يكون سالباً' : 'Purchase price cannot be negative'),
    sellingPrice: z.coerce
      .number({ message: isAr ? 'سعر البيع مطلوب' : 'Selling price is required' })
      .min(0, isAr ? 'سعر البيع لا يمكن أن يكون سالباً' : 'Selling price cannot be negative'),
    taxRate: z.coerce
      .number()
      .min(0, isAr ? 'نسبة الضريبة لا يمكن أن تكون سالبة' : 'Tax rate cannot be negative')
      .max(100, isAr ? 'نسبة الضريبة لا يمكن أن تتجاوز 100%' : 'Tax rate cannot exceed 100%')
      .default(0),
    minimumStock: z.coerce
      .number()
      .int(isAr ? 'الحد الأدنى يجب أن يكون عدداً صحيحاً' : 'Minimum stock must be an integer')
      .min(0, isAr ? 'الحد الأدنى لا يمكن أن يكون سالباً' : 'Minimum stock cannot be negative')
      .default(5),
    isActive: z.boolean().default(true),
  });
}

export type ProductFormValues = z.infer<ReturnType<typeof getProductSchema>>;
