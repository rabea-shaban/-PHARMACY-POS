import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '../../types/auth.types.js';

interface AuthSliceState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  sessionExpired: boolean;
}

const initialState: AuthSliceState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  sessionExpired: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.sessionExpired = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
    setCheckingAuth: (state, action: PayloadAction<boolean>) => {
      state.isCheckingAuth = action.payload;
    },
    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload;
      if (action.payload) {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setUser, clearUser, setCheckingAuth, setSessionExpired } = authSlice.actions;
export default authSlice.reducer;
