import { z } from 'zod';
import i18n from '../../../lib/i18n.js';

export function getPurchaseItemSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    productId: z.string().uuid(isAr ? 'يرجى اختيار الدواء' : 'Please select a product'),
    productName: z.string().optional(),
    barcode: z.string().optional(),
    quantity: z.coerce
      .number()
      .int(isAr ? 'الكمية يجب أن تكون عدداً صحيحاً' : 'Quantity must be an integer')
      .min(1, isAr ? 'الكمية يجب أن تكون عبوة واحدة على الأقل' : 'Quantity must be at least 1'),
    unitCost: z.coerce
      .number({ message: isAr ? 'سعر التكلفة مطلوب' : 'Unit cost is required' })
      .min(0, isAr ? 'سعر التكلفة لا يمكن أن يكون سالباً' : 'Unit cost cannot be negative'),
    discount: z.coerce.number().min(0).default(0),
    tax: z.coerce.number().min(0).default(0),
    batchNumber: z.string().trim().optional().or(z.literal('')),
    expiryDate: z.string().optional().or(z.literal('')),
    sellingPrice: z.coerce.number().min(0).optional(),
  });
}

export function getPurchaseSchema() {
  const isAr = i18n.language === 'ar';

  return z.object({
    supplierId: z.string().uuid(isAr ? 'يرجى اختيار المورد' : 'Please select a supplier'),
    invoiceNumber: z
      .string({ message: isAr ? 'رقم الفاتورة مطلوب' : 'Invoice number is required' })
      .trim()
      .min(1, isAr ? 'رقم الفاتورة مطلوب' : 'Invoice number cannot be empty')
      .max(100, isAr ? 'رقم الفاتورة لا يمكن أن يتجاوز 100 حرف' : 'Invoice number cannot exceed 100 characters'),
    purchaseDate: z.string().optional(),
    discount: z.coerce.number().min(0).default(0),
    tax: z.coerce.number().min(0).default(0),
    paidAmount: z.coerce.number().min(0).default(0),
    notes: z.string().trim().max(1000).optional().nullable(),
    items: z.array(getPurchaseItemSchema()).min(1, isAr ? 'يجب إضافة صنف واحد على الأقل في الفاتورة' : 'Purchase must contain at least one item'),
  });
}

export type PurchaseFormValues = z.infer<ReturnType<typeof getPurchaseSchema>>;
export type PurchaseItemFormValues = z.infer<ReturnType<typeof getPurchaseItemSchema>>;
