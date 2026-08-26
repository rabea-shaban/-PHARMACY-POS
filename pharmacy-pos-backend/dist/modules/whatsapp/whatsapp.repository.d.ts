import { Prisma, WhatsAppStatus } from '@prisma/client';
import { WhatsAppMessageQueryFilters } from './whatsapp.types.js';
export declare class WhatsAppRepository {
    private readonly defaultInclude;
    findMany(filters: WhatsAppMessageQueryFilters): Promise<{
        items: ({
            sale: {
                id: string;
                invoiceNumber: string;
                total: Prisma.Decimal;
            } | null;
            customer: {
                name: string;
                id: string;
                phone: string;
            } | null;
        } & {
            id: string;
            phone: string;
            createdAt: Date;
            saleId: string | null;
            message: string;
            status: import("@prisma/client").$Enums.WhatsAppStatus;
            customerId: string | null;
            providerMessageId: string | null;
            errorMessage: string | null;
            sentAt: Date | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        sale: {
            id: string;
            invoiceNumber: string;
            total: Prisma.Decimal;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        saleId: string | null;
        message: string;
        status: import("@prisma/client").$Enums.WhatsAppStatus;
        customerId: string | null;
        providerMessageId: string | null;
        errorMessage: string | null;
        sentAt: Date | null;
    }) | null>;
    findBySaleId(saleId: string): Promise<({
        sale: {
            id: string;
            invoiceNumber: string;
            total: Prisma.Decimal;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        saleId: string | null;
        message: string;
        status: import("@prisma/client").$Enums.WhatsAppStatus;
        customerId: string | null;
        providerMessageId: string | null;
        errorMessage: string | null;
        sentAt: Date | null;
    }) | null>;
    create(data: {
        customerId?: string | null;
        saleId?: string | null;
        phone: string;
        message: string;
        status?: WhatsAppStatus;
    }): Promise<{
        sale: {
            id: string;
            invoiceNumber: string;
            total: Prisma.Decimal;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        saleId: string | null;
        message: string;
        status: import("@prisma/client").$Enums.WhatsAppStatus;
        customerId: string | null;
        providerMessageId: string | null;
        errorMessage: string | null;
        sentAt: Date | null;
    }>;
    update(id: string, data: {
        status?: WhatsAppStatus;
        providerMessageId?: string | null;
        errorMessage?: string | null;
        sentAt?: Date | null;
    }): Promise<{
        sale: {
            id: string;
            invoiceNumber: string;
            total: Prisma.Decimal;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string;
        } | null;
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        saleId: string | null;
        message: string;
        status: import("@prisma/client").$Enums.WhatsAppStatus;
        customerId: string | null;
        providerMessageId: string | null;
        errorMessage: string | null;
        sentAt: Date | null;
    }>;
}
export declare const whatsAppRepository: WhatsAppRepository;
