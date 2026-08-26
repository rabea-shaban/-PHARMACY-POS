import { Prisma } from '@prisma/client';
import { CommissionTransactionQueryFilters } from './commissions.types.js';
export declare class CommissionsRepository {
    private readonly defaultTransactionInclude;
    findRules(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        percentage: Prisma.Decimal;
        fixedAmount: Prisma.Decimal | null;
        effectiveDate: Date;
    }[]>;
    findRuleById(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        percentage: Prisma.Decimal;
        fixedAmount: Prisma.Decimal | null;
        effectiveDate: Date;
    } | null>;
    findActiveRule(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        percentage: Prisma.Decimal;
        fixedAmount: Prisma.Decimal | null;
        effectiveDate: Date;
    } | null>;
    createRule(data: {
        name: string;
        percentage: number;
        fixedAmount?: number | null;
        effectiveDate?: Date;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        percentage: Prisma.Decimal;
        fixedAmount: Prisma.Decimal | null;
        effectiveDate: Date;
    }>;
    updateRule(id: string, data: {
        name?: string;
        percentage?: number;
        fixedAmount?: number | null;
        isActive?: boolean;
        effectiveDate?: Date;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        percentage: Prisma.Decimal;
        fixedAmount: Prisma.Decimal | null;
        effectiveDate: Date;
    }>;
    findTransactions(filters: CommissionTransactionQueryFilters): Promise<{
        items: ({
            user: {
                name: string;
                id: string;
                role: import("@prisma/client").$Enums.Role;
            };
            sale: {
                id: string;
                invoiceNumber: string;
            } | null;
            commissionRule: {
                name: string;
                id: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            saleId: string | null;
            commissionRuleId: string | null;
            salesAmount: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
            commissionRate: Prisma.Decimal;
        })[];
        total: number;
    }>;
    getSummary(startDate?: Date, endDate?: Date): Promise<{
        totalCommissionsPaid: number;
        totalSalesVolume: number;
        transactionsCount: number;
        staffSummary: {
            userId: string;
            userName: string;
            userRole: string;
            totalCommissions: number;
            salesCount: number;
        }[];
    }>;
}
export declare const commissionsRepository: CommissionsRepository;
