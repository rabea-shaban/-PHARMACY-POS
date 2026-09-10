import { Role } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  role: Role;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    code: string;
    isMain: boolean;
    isActive: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    code: string;
    isMain: boolean;
    isActive: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  user: SafeUser;
  accessToken: string;
}
