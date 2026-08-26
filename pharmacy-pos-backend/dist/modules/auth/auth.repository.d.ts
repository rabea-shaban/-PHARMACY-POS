export declare class AuthRepository {
    private readonly safeSelect;
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
    countUsers(): Promise<number>;
}
export declare const authRepository: AuthRepository;
