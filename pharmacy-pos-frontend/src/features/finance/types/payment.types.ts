import { PaymentMethod } from '../../sales/types/sale.types.js';

export interface PaymentRecord {
  id: string;
  saleId: string;
  invoiceNumber?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string | null;
  notes: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  saleId?: string;
  paymentMethod?: PaymentMethod;
  createdById?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
