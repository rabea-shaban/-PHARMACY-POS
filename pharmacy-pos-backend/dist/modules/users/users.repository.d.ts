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
            branchId: string | null;
            createdAt: Date;
            updatedAt: Date;
            branch: {
                name: string;
                id: string;
                isActive: boolean;
                code: string;
                isMain: boolean;
            } | null;
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
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branch: {
            name: string;
            id: string;
            isActive: boolean;
            code: string;
            isMain: boolean;
        } | null;
    } | null>;
    findByIdWithPassword(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        branchId: string | null;
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
        branchId: string | null;
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
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: {
        name: string;
        phone: string;
        email?: string | null;
        passwordHash: string;
        role: Role;
        branchId?: string | null;
    }): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branch: {
            name: string;
            id: string;
            isActive: boolean;
            code: string;
            isMain: boolean;
        } | null;
    }>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        email?: string | null;
        passwordHash?: string;
        role?: Role;
        branchId?: string | null;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branch: {
            name: string;
            id: string;
            isActive: boolean;
            code: string;
            isMain: boolean;
        } | null;
    }>;
    softDelete(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branch: {
            name: string;
            id: string;
            isActive: boolean;
            code: string;
            isMain: boolean;
        } | null;
    }>;
}
export declare const usersRepository: UsersRepository;
