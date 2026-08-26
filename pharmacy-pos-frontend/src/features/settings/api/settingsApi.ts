import { api } from '../../../lib/api.js';
import { ApiResponse } from '../../../types/api.types.js';
import {
  SystemSettingItem,
  SystemSettingsMap,
  UpdateSettingsInput,
  UpdateSingleSettingInput,
  PublicSettingsResponse,
  WhatsAppMessageQueryFilters,
  PaginatedWhatsAppMessagesResponse,
  WhatsAppMessageResponse,
} from '../types/settings.types.js';

export const settingsApi = {
  // 1. Get Public Settings (Open to POS / Receipts / Public UI)
  getPublicSettings: async (): Promise<PublicSettingsResponse> => {
    const response = await api.get<ApiResponse<PublicSettingsResponse>>('/settings/public');
    return response.data.data;
  },

  // 2. Get All System Settings (Managers & Accountants)
  getAllSettings: async (): Promise<{ map: SystemSettingsMap; items: SystemSettingItem[] }> => {
    const response = await api.get<
      ApiResponse<{ map: SystemSettingsMap; items: SystemSettingItem[] }>
    >('/settings');
    return response.data.data;
  },

  // 3. Get Single Setting by Key
  getSettingByKey: async (key: string): Promise<SystemSettingItem> => {
    const response = await api.get<ApiResponse<SystemSettingItem>>(`/settings/${key}`);
    return response.data.data;
  },

  // 4. Batch Update Settings (Managers only)
  updateSettings: async (input: UpdateSettingsInput): Promise<{ items: SystemSettingItem[] }> => {
    const response = await api.patch<ApiResponse<{ items: SystemSettingItem[] }>>(
      '/settings',
      input
    );
    return response.data.data;
  },

  // 5. Update Single Setting (Managers only)
  updateSingleSetting: async (
    key: string,
    input: UpdateSingleSettingInput
  ): Promise<SystemSettingItem> => {
    const response = await api.patch<ApiResponse<SystemSettingItem>>(
      `/settings/${key}`,
      input
    );
    return response.data.data;
  },

  // 6. WhatsApp Messages Logs (Audit / Notifications)
  getWhatsAppMessages: async (
    params?: WhatsAppMessageQueryFilters
  ): Promise<PaginatedWhatsAppMessagesResponse> => {
    const response = await api.get<ApiResponse<PaginatedWhatsAppMessagesResponse>>(
      '/whatsapp/messages',
      { params }
    );
    return response.data.data;
  },

  // 7. Get WhatsApp Message by ID
  getWhatsAppMessageById: async (id: string): Promise<WhatsAppMessageResponse> => {
    const response = await api.get<ApiResponse<WhatsAppMessageResponse>>(
      `/whatsapp/messages/${id}`
    );
    return response.data.data;
  },

  // 8. Retry Failed WhatsApp Message
  retryWhatsAppMessage: async (id: string): Promise<WhatsAppMessageResponse> => {
    const response = await api.post<ApiResponse<WhatsAppMessageResponse>>(
      `/whatsapp/messages/${id}/retry`
    );
    return response.data.data;
  },
};
