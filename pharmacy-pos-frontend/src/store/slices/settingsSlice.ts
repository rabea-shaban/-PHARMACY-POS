import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch } from '../../features/branches/types/branch.types.js';

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
  activeBranch: Branch | null;
  activeBranchId: string | null;
  branches: Branch[];
}

const getStoredActiveBranch = (): { branch: Branch | null; id: string | null } => {
  if (typeof window === 'undefined') return { branch: null, id: null };
  try {
    const raw = localStorage.getItem('virexa_active_branch');
    const id = localStorage.getItem('virexa_active_branch_id');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { branch: parsed, id: parsed.id || id };
    }
    return { branch: null, id: id || null };
  } catch {
    return { branch: null, id: null };
  }
};

const initialBranchState = getStoredActiveBranch();

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
  activeBranch: initialBranchState.branch,
  activeBranchId: initialBranchState.id,
  branches: [],
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
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
      if (!state.activeBranch && action.payload.length > 0) {
        const matched = state.activeBranchId
          ? action.payload.find((b) => b.id === state.activeBranchId)
          : null;
        const main = action.payload.find((b) => b.isMain);
        const resolved = matched || main || action.payload[0];
        state.activeBranch = resolved;
        state.activeBranchId = resolved.id;
        try {
          localStorage.setItem('virexa_active_branch', JSON.stringify(resolved));
          localStorage.setItem('virexa_active_branch_id', resolved.id);
        } catch {
          // ignore
        }
      } else if (state.activeBranch && action.payload.length > 0) {
        const updated = action.payload.find((b) => b.id === state.activeBranch?.id);
        if (updated) {
          state.activeBranch = updated;
        }
      }
    },
    setActiveBranch: (state, action: PayloadAction<Branch | null>) => {
      state.activeBranch = action.payload;
      state.activeBranchId = action.payload ? action.payload.id : null;
      try {
        if (action.payload) {
          localStorage.setItem('virexa_active_branch', JSON.stringify(action.payload));
          localStorage.setItem('virexa_active_branch_id', action.payload.id);
        } else {
          localStorage.removeItem('virexa_active_branch');
          localStorage.removeItem('virexa_active_branch_id');
        }
      } catch {
        // ignore
      }
    },
  },
});

export const { setPublicSettings, setBranches, setActiveBranch } = settingsSlice.actions;
export default settingsSlice.reducer;

