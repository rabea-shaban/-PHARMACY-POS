import { z } from 'zod';

const paymentMethodEnum = ['CASH', 'VISA', 'WALLET', 'OTHER'] as const;
const saleStatusEnum = ['COMPLETED', 'DRAFT', 'CANCELLED', 'PARTIALLY_RETURNED', 'RETURNED'] as const;

export const saleIdParamSchema = z.object({
  id: z.string().uuid('Sale ID must be a valid UUID'),
});

export const checkoutItemSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
  quantity: z.number().int().positive('Quantity must be an integer greater than 0'),
});

export const checkoutPaymentSchema = z.object({
  paymentMethod: z.enum(paymentMethodEnum, { message: 'Invalid payment method' }),
  amount: z.number().positive('Payment amount must be greater than 0'),
  referenceNumber: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(255).optional().nullable(),
});

export const checkoutRequestSchema = z.object({
  customerId: z.string().uuid('Customer ID must be a valid UUID').optional().nullable(),
  items: z.array(checkoutItemSchema).min(1, 'At least one product item is required for checkout'),
  discountId: z.string().uuid().optional().nullable(),
  discountCode: z.string().trim().optional().nullable(),
  discountAmount: z.number().min(0).optional().nullable(),
  customerInsuranceId: z.string().uuid().optional().nullable(),
  redeemPoints: z.number().int().min(0).default(0),
  payments: z.array(checkoutPaymentSchema).min(1, 'At least one payment record is required'),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const saleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  invoiceNumber: z.string().trim().optional(),
  customerId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: z.enum(saleStatusEnum).optional(),
  paymentMethod: z.enum(paymentMethodEnum).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['invoiceNumber', 'total', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const cancelSaleSchema = z.object({
  reason: z.string().trim().min(3, 'Cancellation reason must be at least 3 characters').max(500),
});

export type CheckoutRequestDTO = z.infer<typeof checkoutRequestSchema>;
export type SaleQueryDTO = z.infer<typeof saleQuerySchema>;
export type CancelSaleDTO = z.infer<typeof cancelSaleSchema>;
