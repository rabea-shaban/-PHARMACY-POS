import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UISliceState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
}

const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('pharmacy_theme') : null) as 'light' | 'dark' | null;
const initialTheme = savedTheme || 'light';

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
  language: 'ar',
  direction: 'rtl',
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
      document.documentElement.setAttribute('dir', state.direction);
      document.documentElement.setAttribute('lang', action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, toggleTheme, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
