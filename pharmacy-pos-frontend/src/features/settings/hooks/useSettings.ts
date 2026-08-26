import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settingsApi.js';
import {
  UpdateSettingsInput,
  UpdateSingleSettingInput,
  WhatsAppMessageQueryFilters,
} from '../types/settings.types.js';
import { useAppDispatch } from '../../../store/hooks.js';
import { setPublicSettings } from '../../../store/slices/settingsSlice.js';

export const SETTINGS_QUERY_KEYS = {
  all: ['settings'] as const,
  map: () => [...SETTINGS_QUERY_KEYS.all, 'map'] as const,
  public: () => [...SETTINGS_QUERY_KEYS.all, 'public'] as const,
  single: (key: string) => [...SETTINGS_QUERY_KEYS.all, 'single', key] as const,
  whatsapp: (filters?: WhatsAppMessageQueryFilters) => ['whatsapp', 'messages', filters] as const,
  whatsappDetail: (id: string) => ['whatsapp', 'message', id] as const,
};

// Hook: Fetch All Settings
export const useAllSettings = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.map(),
    queryFn: () => settingsApi.getAllSettings(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook: Fetch Public Settings
export const usePublicSettings = () => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.public(),
    queryFn: async () => {
      const data = await settingsApi.getPublicSettings();
      // Sync into Redux store so POS and Receipt headers get instant updates
      dispatch(setPublicSettings(data));
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Hook: Fetch Single Setting
export const useSettingByKey = (key: string) => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.single(key),
    queryFn: () => settingsApi.getSettingByKey(key),
    enabled: Boolean(key),
  });
};

// Hook: Batch Update Settings
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (input: UpdateSettingsInput) => settingsApi.updateSettings(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      // Invalidate POS and Reports caches so any new tax rates / thresholds reflect immediately
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Refetch public settings to update Redux
      const pub = await settingsApi.getPublicSettings();
      dispatch(setPublicSettings(pub));
    },
  });
};

// Hook: Update Single Setting
export const useUpdateSingleSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, input }: { key: string; input: UpdateSingleSettingInput }) =>
      settingsApi.updateSingleSetting(key, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
    },
  });
};

// Hook: WhatsApp Message History
export const useWhatsAppMessages = (filters?: WhatsAppMessageQueryFilters) => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.whatsapp(filters),
    queryFn: () => settingsApi.getWhatsAppMessages(filters),
    staleTime: 30 * 1000,
  });
};

// Hook: Retry WhatsApp Message
export const useRetryWhatsAppMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settingsApi.retryWhatsAppMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp'] });
    },
  });
};
