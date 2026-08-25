import { PaymentMethod } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface PaymentResponse {
  id: string;
  saleId: string;
  invoiceNumber?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string | null;
  notes: string | null;
  createdById: string;
  createdByName: string;
  createdAt: Date;
}

export interface PaymentQueryFilters {
  page?: number;
  limit?: number;
  saleId?: string;
  paymentMethod?: PaymentMethod;
  createdById?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  sortBy?: 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPaymentsResponse {
  items: PaymentResponse[];
  pagination: PaginationMeta;
}
