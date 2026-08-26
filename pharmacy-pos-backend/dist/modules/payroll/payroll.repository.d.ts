import { Prisma, PayrollStatus, PaymentMethod } from '@prisma/client';
import { PayrollQueryFilters } from './payroll.types.js';
export declare class PayrollRepository {
    private readonly defaultInclude;
    findMany(filters: PayrollQueryFilters): Promise<{
        items: ({
            user: {
                name: string;
                id: string;
                phone: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            baseSalary: Prisma.Decimal;
            commission: Prisma.Decimal;
            bonus: Prisma.Decimal;
            deductions: Prisma.Decimal;
            netSalary: Prisma.Decimal;
            periodStart: Date;
            periodEnd: Date;
            status: import("@prisma/client").$Enums.PayrollStatus;
            paidAt: Date | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    }) | null>;
    findByEmployeeAndPeriod(userId: string, periodStart: Date, periodEnd: Date): Promise<({
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    }) | null>;
    findByEmployeeId(userId: string): Promise<({
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    })[]>;
    create(data: {
        userId: string;
        baseSalary: number;
        commission: number;
        bonus: number;
        deductions: number;
        netSalary: number;
        periodStart: Date;
        periodEnd: Date;
        status?: PayrollStatus;
    }): Promise<{
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    }>;
    update(id: string, data: {
        baseSalary?: number;
        commission?: number;
        bonus?: number;
        deductions?: number;
        netSalary?: number;
        status?: PayrollStatus;
        paidAt?: Date | null;
    }): Promise<{
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    }>;
    delete(id: string): Promise<{
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    }>;
    payPayrollAtomic(payrollId: string, paymentMethod: PaymentMethod | undefined, actorId: string, notes?: string): Promise<{
        user: {
            name: string;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        baseSalary: Prisma.Decimal;
        commission: Prisma.Decimal;
        bonus: Prisma.Decimal;
        deductions: Prisma.Decimal;
        netSalary: Prisma.Decimal;
        periodStart: Date;
        periodEnd: Date;
        status: import("@prisma/client").$Enums.PayrollStatus;
        paidAt: Date | null;
    }>;
    getSummary(startDate?: Date, endDate?: Date): Promise<{
        totalEmployeesCount: number;
        totalBaseSalaries: number;
        totalCommissionPaid: number;
        totalBonuses: number;
        totalDeductions: number;
        totalPayrollPayable: number;
        totalPaidAmount: number;
        totalPendingAmount: number;
        statusDistribution: {
            totalNetSalary: number;
            status: PayrollStatus;
            count: number;
        }[];
    }>;
}
export declare const payrollRepository: PayrollRepository;
