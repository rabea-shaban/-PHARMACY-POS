import { Prisma } from '@prisma/client';
import { InsuranceQueryFilters } from './insurance.types.js';
export declare class InsuranceRepository {
    findManyProviders(filters: InsuranceQueryFilters): Promise<{
        items: {
            name: string;
            id: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            defaultCoveragePercentage: Prisma.Decimal;
        }[];
        total: number;
    }>;
    findProviderById(id: string): Promise<{
        name: string;
        id: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        defaultCoveragePercentage: Prisma.Decimal;
    } | null>;
    findProviderByName(name: string): Promise<{
        name: string;
        id: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        defaultCoveragePercentage: Prisma.Decimal;
    } | null>;
    createProvider(data: {
        name: string;
        phone?: string | null;
        email?: string | null;
        address?: string | null;
        defaultCoveragePercentage?: number;
        notes?: string | null;
    }): Promise<{
        name: string;
        id: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        defaultCoveragePercentage: Prisma.Decimal;
    }>;
    updateProvider(id: string, data: {
        name?: string;
        phone?: string | null;
        email?: string | null;
        address?: string | null;
        defaultCoveragePercentage?: number;
        notes?: string | null;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        phone: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        address: string | null;
        defaultCoveragePercentage: Prisma.Decimal;
    }>;
    findCustomerInsurances(customerId: string): Promise<({
        insuranceProvider: {
            name: string;
            id: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            defaultCoveragePercentage: Prisma.Decimal;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        insuranceProviderId: string;
        policyNumber: string;
        memberNumber: string;
        coveragePercentage: Prisma.Decimal;
        maxCoverageLimit: Prisma.Decimal | null;
        expiryDate: Date | null;
    })[]>;
    findCustomerInsuranceById(id: string): Promise<({
        insuranceProvider: {
            name: string;
            id: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            defaultCoveragePercentage: Prisma.Decimal;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        insuranceProviderId: string;
        policyNumber: string;
        memberNumber: string;
        coveragePercentage: Prisma.Decimal;
        maxCoverageLimit: Prisma.Decimal | null;
        expiryDate: Date | null;
    }) | null>;
    createCustomerInsurance(data: {
        customerId: string;
        insuranceProviderId: string;
        policyNumber: string;
        memberNumber: string;
        coveragePercentage: number;
        maxCoverageLimit?: number | null;
        expiryDate?: Date | null;
    }): Promise<{
        insuranceProvider: {
            name: string;
            id: string;
            phone: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            address: string | null;
            defaultCoveragePercentage: Prisma.Decimal;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        insuranceProviderId: string;
        policyNumber: string;
        memberNumber: string;
        coveragePercentage: Prisma.Decimal;
        maxCoverageLimit: Prisma.Decimal | null;
        expiryDate: Date | null;
    }>;
}
export declare const insuranceRepository: InsuranceRepository;
