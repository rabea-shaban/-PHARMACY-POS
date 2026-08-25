import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n, { applyLanguageSettings } from '../../lib/i18n.js';

interface UISliceState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
}

const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('pharmacy_theme') : null) as 'light' | 'dark' | null;
const initialTheme = savedTheme || 'light';

const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('pharmacy_language') : null) as 'ar' | 'en' | null;
const initialLang = savedLang || 'ar';

// Ensure DOM class matches initial state
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const initialState: UISliceState = {
  sidebarOpen: true,
  theme: initialTheme,
  language: initialLang,
  direction: initialLang === 'ar' ? 'rtl' : 'ltr',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      try {
        localStorage.setItem('pharmacy_theme', action.payload);
      } catch {
        // Ignore
      }
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      try {
        localStorage.setItem('pharmacy_theme', nextTheme);
      } catch {
        // Ignore
      }
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setLanguage: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.language = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';
      try {
        localStorage.setItem('pharmacy_language', action.payload);
      } catch {
        // Ignore
      }
      i18n.changeLanguage(action.payload);
      applyLanguageSettings(action.payload);
    },
    toggleLanguage: (state) => {
      const nextLang = state.language === 'ar' ? 'en' : 'ar';
      state.language = nextLang;
      state.direction = nextLang === 'ar' ? 'rtl' : 'ltr';
      try {
        localStorage.setItem('pharmacy_language', nextLang);
      } catch {
        // Ignore
      }
      i18n.changeLanguage(nextLang);
      applyLanguageSettings(nextLang);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, toggleTheme, setLanguage, toggleLanguage } = uiSlice.actions;
export default uiSlice.reducer;
