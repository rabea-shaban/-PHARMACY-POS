export interface SystemSettingItem {
  id: string;
  key: string;
  value: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsMap {
  [key: string]: string;
}

export interface UpdateSettingEntry {
  key: string;
  value: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateSettingsInput {
  settings: UpdateSettingEntry[];
}

export interface UpdateSingleSettingInput {
  value: string;
  description?: string;
  isPublic?: boolean;
}

export interface PublicSettingsResponse {
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyAddress: string;
  pharmacyLogo?: string;
  pharmacySlogan?: string;
  pharmacyLicense?: string;
  pharmacyTaxNumber?: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
}

export type WhatsAppStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

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
  sentAt: string | null;
  createdAt: string;
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
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
