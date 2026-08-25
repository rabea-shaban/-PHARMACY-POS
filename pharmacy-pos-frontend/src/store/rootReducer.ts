import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import cartReducer from './slices/cartSlice.js';
import settingsReducer from './slices/settingsSlice.js';
import notificationReducer from './slices/notificationSlice.js';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cart: cartReducer,
  settings: settingsReducer,
  notifications: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
