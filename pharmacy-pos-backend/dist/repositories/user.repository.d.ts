import { Role } from '@prisma/client';
export interface UserFilterParams {
    page: number;
    limit: number;
    search?: string;
    role?: Role;
    isActive?: boolean;
    sortBy?: 'name' | 'createdAt' | 'role';
    sortOrder?: 'asc' | 'desc';
}
export declare class UserRepository {
    private readonly safeSelect;
    findMany(params: UserFilterParams): Promise<{
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
    findByIdentifier(identifier: string): Promise<{
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
export declare const userRepository: UserRepository;
