import { SaleStatus, PaymentMethod } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutPaymentInput {
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNumber?: string | null;
  notes?: string | null;
}

export interface CheckoutRequestInput {
  customerId?: string | null;
  items: CheckoutItemInput[];
  discountId?: string | null;
  discountCode?: string | null;
  customerInsuranceId?: string | null;
  redeemPoints?: number;
  payments: CheckoutPaymentInput[];
  notes?: string | null;
}

export interface SaleItemResponse {
  id: string;
  productId: string;
  productName: string;
  barcode: string;
  batchId: string | null;
  batchNumber?: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface SalePaymentResponse {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string | null;
  notes: string | null;
  createdByName: string;
  createdAt: Date;
}

export interface SaleInsuranceResponse {
  id: string;
  providerName: string;
  coveredAmount: number;
  customerAmount: number;
  coveragePercentage: number;
  claimReference: string | null;
}

export interface SaleResponse {
  id: string;
  invoiceNumber: string;
  customerId: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  userId: string;
  cashierName: string;
  subtotal: number;
  discount: number;
  discountReason: string | null;
  insuranceAmount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: SaleStatus;
  notes: string | null;
  items: SaleItemResponse[];
  payments: SalePaymentResponse[];
  insurance?: SaleInsuranceResponse | null;
  loyaltyEarned?: number;
  loyaltyRedeemed?: number;
  commissionEarned?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  invoiceNumber?: string;
  customerId?: string;
  userId?: string;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string | Date;
  endDate?: string | Date;
  sortBy?: 'invoiceNumber' | 'total' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedSalesResponse {
  items: SaleResponse[];
  pagination: PaginationMeta;
}
