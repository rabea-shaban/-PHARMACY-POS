import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UISliceState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
}

const initialState: UISliceState = {
  sidebarOpen: true,
  theme: 'light',
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
      if (action.payload === 'dark') {
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

export const { toggleSidebar, setSidebarOpen, setTheme, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
