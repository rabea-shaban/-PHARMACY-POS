import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PublicSettings {
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
  receiptFooterText?: string;
  receiptReturnPolicy?: string;
  receiptWidth?: string;
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
    pharmacyLogo: '',
    pharmacySlogan: 'رعاية صحية متكاملة لأسرتك',
    pharmacyLicense: '10482 / 2026',
    pharmacyTaxNumber: '321-654-987',
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
    setPublicSettings: (state, action: PayloadAction<Partial<PublicSettings>>) => {
      state.publicSettings = {
        ...state.publicSettings,
        ...action.payload,
      };
      state.isLoaded = true;
    },
  },
});

export const { setPublicSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
