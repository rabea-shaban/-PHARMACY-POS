import { Product } from '../../products/types/product.types.js';
import { PaymentMethod } from './sale.types.js';

export interface CartItemModel {
  product: Product;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
}

export interface AppliedDiscount {
  id?: string;
  code?: string;
  type: 'PERCENTAGE' | 'FIXED' | 'PROMOTIONAL' | 'CUSTOMER_TIER' | 'MANUAL';
  value: number;
  name?: string;
}

export interface AppliedInsurance {
  policyId: string;
  providerName: string;
  coveragePercentage: number;
  claimReference?: string;
}

export interface AppliedLoyalty {
  pointsToRedeem: number;
  discountAmount: number;
}

export interface PaymentEntry {
  id: string;
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNumber?: string;
  notes?: string;
}
