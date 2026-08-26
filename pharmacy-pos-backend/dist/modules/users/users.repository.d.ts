import { Role } from '@prisma/client';
import { UserQueryParams } from './users.types.js';
export declare class UsersRepository {
    private readonly safeSelect;
    findMany(params: UserQueryParams): Promise<{
        items: {
            name: string;
            id: string;
            phone: string;
            email: string | null;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByIdWithPassword(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByPhone(phone: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: {
        name: string;
        phone: string;
        email?: string | null;
        passwordHash: string;
        role: Role;
    }): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        email?: string | null;
        passwordHash?: string;
        role?: Role;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    softDelete(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const usersRepository: UsersRepository;
