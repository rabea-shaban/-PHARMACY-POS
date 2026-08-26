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
    createdAt: Date;
    updatedAt: Date;
}
export interface LoginResult {
    user: SafeUser;
    accessToken: string;
}
