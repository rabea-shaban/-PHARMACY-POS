import { Prisma } from '@prisma/client';
import { PaymentQueryFilters } from './payments.types.js';
export declare class PaymentsRepository {
    private readonly defaultInclude;
    findMany(filters: PaymentQueryFilters): Promise<{
        items: ({
            sale: {
                id: string;
                invoiceNumber: string;
            };
            createdBy: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            saleId: string;
            amount: Prisma.Decimal;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            createdById: string;
            referenceNumber: string | null;
            notes: string | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        sale: {
            id: string;
            invoiceNumber: string;
        };
        createdBy: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        saleId: string;
        amount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        createdById: string;
        referenceNumber: string | null;
        notes: string | null;
    }) | null>;
    findBySaleId(saleId: string): Promise<({
        sale: {
            id: string;
            invoiceNumber: string;
        };
        createdBy: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        saleId: string;
        amount: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        createdById: string;
        referenceNumber: string | null;
        notes: string | null;
    })[]>;
}
export declare const paymentsRepository: PaymentsRepository;
