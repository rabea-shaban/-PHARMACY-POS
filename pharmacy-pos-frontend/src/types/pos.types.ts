import { Product } from './product.types.js';
import { Customer } from './customer.types.js';

export type PaymentMethod = 'CASH' | 'VISA' | 'WALLET' | 'OTHER';

export interface CartItem {
  product: Product;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
}

export interface SplitPaymentLine {
  paymentMethod: PaymentMethod;
  amount: number;
}

export interface CartState {
  items: CartItem[];
  customer: Customer | null;
  discountId: string | null;
  discountPercentage: number;
  pointsToRedeem: number;
  redeemedDiscountAmount: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}
