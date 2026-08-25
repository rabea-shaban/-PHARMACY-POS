import { WhatsAppStatus } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface WhatsAppMessageResponse {
  id: string;
  customerId: string | null;
  customerName: string | null;
  saleId: string | null;
  saleInvoiceNumber: string | null;
  phone: string;
  message: string;
  status: WhatsAppStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  sentAt: Date | null;
  createdAt: Date;
}

export interface EnqueueInvoiceMessageInput {
  saleId: string;
  invoiceNumber: string;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  total: number;
  paidAmount: number;
  cashierName?: string;
  itemsCount?: number;
}

export interface WhatsAppMessageQueryFilters {
  page?: number;
  limit?: number;
  customerId?: string;
  saleId?: string;
  phone?: string;
  status?: WhatsAppStatus;
  from?: string;
  to?: string;
}

export interface PaginatedWhatsAppMessagesResponse {
  items: WhatsAppMessageResponse[];
  pagination: PaginationMeta;
}

export interface WhatsAppSendResult {
  success: boolean;
  providerMessageId?: string;
  errorMessage?: string;
}

export interface IWhatsAppProvider {
  sendMessage(phone: string, message: string): Promise<WhatsAppSendResult>;
}
