export type SaleStatus = 'COMPLETED' | 'DRAFT' | 'CANCELLED' | 'PARTIALLY_RETURNED' | 'RETURNED';
export type PaymentMethod = 'CASH' | 'VISA' | 'WALLET' | 'OTHER';

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  barcode: string;
  batchId?: string | null;
  batchNumber?: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface SalePayment {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  notes?: string | null;
  createdByName?: string;
  createdAt: string;
}

export interface SaleInsurance {
  id: string;
  providerName: string;
  coveredAmount: number;
  customerAmount: number;
  coveragePercentage: number;
  claimReference?: string | null;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  userId: string;
  cashierName: string;
  subtotal: number;
  discount: number;
  discountReason?: string | null;
  insuranceAmount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: SaleStatus;
  notes?: string | null;
  items: SaleItem[];
  payments: SalePayment[];
  insurance?: SaleInsurance | null;
  loyaltyEarned?: number;
  loyaltyRedeemed?: number;
  commissionEarned?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutItemPayload {
  productId: string;
  quantity: number;
}

export interface CheckoutPaymentPayload {
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNumber?: string | null;
  notes?: string | null;
}

export interface CheckoutRequestPayload {
  customerId?: string | null;
  items: CheckoutItemPayload[];
  discountId?: string | null;
  discountCode?: string | null;
  customerInsuranceId?: string | null;
  redeemPoints?: number;
  payments: CheckoutPaymentPayload[];
  notes?: string | null;
}

export interface SaleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  invoiceNumber?: string;
  customerId?: string;
  userId?: string;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  sortBy?: 'invoiceNumber' | 'total' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
