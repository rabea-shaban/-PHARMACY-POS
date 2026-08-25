export type Role = 'PLATFORM_MANAGER' | 'PHARMACY_MANAGER' | 'PHARMACIST' | 'ACCOUNTANT';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  identifier?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  error: string | null;
}
