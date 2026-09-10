import { Prisma } from '@prisma/client';
import { DiscountQueryFilters } from './discounts.types.js';
export declare class DiscountsRepository {
    findMany(filters: DiscountQueryFilters): Promise<{
        items: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.DiscountType;
            startDate: Date | null;
            endDate: Date | null;
            code: string | null;
            value: Prisma.Decimal;
            minimumPurchase: Prisma.Decimal;
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DiscountType;
        startDate: Date | null;
        endDate: Date | null;
        code: string | null;
        value: Prisma.Decimal;
        minimumPurchase: Prisma.Decimal;
    } | null>;
    findByCode(code: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DiscountType;
        startDate: Date | null;
        endDate: Date | null;
        code: string | null;
        value: Prisma.Decimal;
        minimumPurchase: Prisma.Decimal;
    } | null>;
    create(data: {
        code?: string | null;
        name: string;
        type: Prisma.DiscountCreateInput['type'];
        value: number;
        minimumPurchase?: number;
        startDate?: Date | null;
        endDate?: Date | null;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DiscountType;
        startDate: Date | null;
        endDate: Date | null;
        code: string | null;
        value: Prisma.Decimal;
        minimumPurchase: Prisma.Decimal;
    }>;
    update(id: string, data: {
        code?: string | null;
        name?: string;
        type?: Prisma.DiscountUpdateInput['type'];
        value?: number;
        minimumPurchase?: number;
        startDate?: Date | null;
        endDate?: Date | null;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DiscountType;
        startDate: Date | null;
        endDate: Date | null;
        code: string | null;
        value: Prisma.Decimal;
        minimumPurchase: Prisma.Decimal;
    }>;
    softDelete(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.DiscountType;
        startDate: Date | null;
        endDate: Date | null;
        code: string | null;
        value: Prisma.Decimal;
        minimumPurchase: Prisma.Decimal;
    }>;
}
export declare const discountsRepository: DiscountsRepository;
