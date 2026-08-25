import { Role, User } from '../../../types/auth.types.js';

export interface LoginPayload {
  identifier: string; // phone or email or username
  password: string;
}

export interface BackendLoginResponse {
  user: User;
  accessToken: string;
}

export interface AuthContextState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
}
