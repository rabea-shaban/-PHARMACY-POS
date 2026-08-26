import { LoyaltyTransactionType, Prisma } from '@prisma/client';
import { LoyaltyTransactionQueryFilters } from './loyalty.types.js';
export declare class LoyaltyRepository {
    findByCustomerId(customerId: string): Promise<({
        customer: {
            name: string;
            id: string;
            phone: string;
            tier: {
                name: string;
                id: string;
                isActive: boolean;
                description: string | null;
                discountPercentage: Prisma.Decimal;
                minimumPoints: number;
            } | null;
        };
        transactions: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.LoyaltyTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
            loyaltyAccountId: string;
            points: number;
            balanceAfter: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        totalPoints: number;
    }) | null>;
    findTransactions(loyaltyAccountId: string, filters: LoyaltyTransactionQueryFilters): Promise<{
        items: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.LoyaltyTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
            loyaltyAccountId: string;
            points: number;
            balanceAfter: number;
        }[];
        total: number;
    }>;
    findAllTiers(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        discountPercentage: Prisma.Decimal;
        minimumPoints: number;
    }[]>;
    applyPointsTransactionAtomic(params: {
        customerId: string;
        pointsDelta: number;
        type: LoyaltyTransactionType;
        reason?: string | null;
        referenceType?: string | null;
        referenceId?: string | null;
    }): Promise<{
        account: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            totalPoints: number;
        };
        transaction: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.LoyaltyTransactionType;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
            loyaltyAccountId: string;
            points: number;
            balanceAfter: number;
        };
        upgradedTier: {
            id: string;
            name: string;
        } | null;
    }>;
}
export declare const loyaltyRepository: LoyaltyRepository;
