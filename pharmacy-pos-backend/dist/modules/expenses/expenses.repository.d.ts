import { Prisma, ExpenseCategory, PaymentMethod } from '@prisma/client';
import { ExpenseQueryFilters } from './expenses.types.js';
export declare class ExpensesRepository {
    private readonly defaultInclude;
    findMany(filters: ExpenseQueryFilters): Promise<{
        items: ({
            createdBy: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: Prisma.Decimal;
            category: import("@prisma/client").$Enums.ExpenseCategory;
            description: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            expenseDate: Date;
            createdById: string;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        createdBy: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: Prisma.Decimal;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        description: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        createdById: string;
    }) | null>;
    create(data: {
        amount: number;
        category: ExpenseCategory;
        description: string;
        paymentMethod: PaymentMethod;
        expenseDate: Date;
        createdById: string;
    }): Promise<{
        createdBy: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: Prisma.Decimal;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        description: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        createdById: string;
    }>;
    update(id: string, data: {
        amount?: number;
        category?: ExpenseCategory;
        description?: string;
        paymentMethod?: PaymentMethod;
        expenseDate?: Date;
    }): Promise<{
        createdBy: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: Prisma.Decimal;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        description: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        createdById: string;
    }>;
    delete(id: string): Promise<{
        createdBy: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: Prisma.Decimal;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        description: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        createdById: string;
    }>;
    getSummary(startDate?: Date, endDate?: Date): Promise<{
        totalExpenses: number;
        expensesCount: number;
        categoryBreakdown: {
            category: import("@prisma/client").$Enums.ExpenseCategory;
            totalAmount: number;
            count: number;
        }[];
        paymentMethodBreakdown: {
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            totalAmount: number;
            count: number;
        }[];
    }>;
}
export declare const expensesRepository: ExpensesRepository;
