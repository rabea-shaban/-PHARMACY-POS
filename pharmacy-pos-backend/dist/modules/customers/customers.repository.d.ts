import { Prisma, Gender } from '@prisma/client';
import { CustomerQueryFilters } from './customers.types.js';
export declare class CustomersRepository {
    private readonly defaultInclude;
    findMany(filters: CustomerQueryFilters): Promise<{
        items: ({
            loyaltyAccount: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                totalPoints: number;
            } | null;
            tier: {
                name: string;
                id: string;
                description: string | null;
                discountPercentage: Prisma.Decimal;
                minimumPoints: number;
            } | null;
        } & {
            name: string;
            id: string;
            phone: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            tierId: string | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        loyaltyAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalPoints: number;
        } | null;
        tier: {
            name: string;
            id: string;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        } | null;
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        tierId: string | null;
    }) | null>;
    findByPhone(phone: string): Promise<({
        loyaltyAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalPoints: number;
        } | null;
        tier: {
            name: string;
            id: string;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        } | null;
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        tierId: string | null;
    }) | null>;
    findByEmail(email: string): Promise<({
        loyaltyAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalPoints: number;
        } | null;
        tier: {
            name: string;
            id: string;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        } | null;
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        tierId: string | null;
    }) | null>;
    findDefaultTier(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        discountPercentage: Prisma.Decimal;
        minimumPoints: number;
    } | null>;
    create(data: {
        name: string;
        phone: string;
        email?: string | null;
        address?: string | null;
        notes?: string | null;
        dateOfBirth?: Date | null;
        gender?: Gender | null;
        tierId?: string | null;
    }): Promise<{
        loyaltyAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalPoints: number;
        } | null;
        tier: {
            name: string;
            id: string;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        } | null;
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        tierId: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        email?: string | null;
        address?: string | null;
        notes?: string | null;
        dateOfBirth?: Date | null;
        gender?: Gender | null;
        tierId?: string | null;
        isActive?: boolean;
    }): Promise<{
        loyaltyAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalPoints: number;
        } | null;
        tier: {
            name: string;
            id: string;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        } | null;
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        tierId: string | null;
    }>;
    softDelete(id: string): Promise<{
        loyaltyAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            totalPoints: number;
        } | null;
        tier: {
            name: string;
            id: string;
            description: string | null;
            discountPercentage: Prisma.Decimal;
            minimumPoints: number;
        } | null;
    } & {
        name: string;
        id: string;
        phone: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        tierId: string | null;
    }>;
    findCustomerPurchases(customerId: string, page: number, limit: number): Promise<{
        sales: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.SaleStatus;
            invoiceNumber: string;
            subtotal: Prisma.Decimal;
            discount: Prisma.Decimal;
            tax: Prisma.Decimal;
            total: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            remainingAmount: Prisma.Decimal;
        }[];
        total: number;
    }>;
}
export declare const customersRepository: CustomersRepository;
