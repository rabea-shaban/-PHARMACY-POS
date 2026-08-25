import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PublicSettings {
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyAddress: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
}

interface SettingsSliceState {
  publicSettings: PublicSettings;
  isLoaded: boolean;
}

const initialState: SettingsSliceState = {
  publicSettings: {
    pharmacyName: 'Al-Amal Modern Pharmacy (صيدلية الأمل الحديثة)',
    pharmacyPhone: '+201012345678',
    pharmacyAddress: 'Cairo, Egypt',
    currency: 'EGP',
    taxRate: 0,
    invoicePrefix: 'INV',
  },
  isLoaded: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPublicSettings: (state, action: PayloadAction<PublicSettings>) => {
      state.publicSettings = action.payload;
      state.isLoaded = true;
    },
  },
});

export const { setPublicSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
