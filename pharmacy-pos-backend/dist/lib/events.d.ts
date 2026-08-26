import { EventEmitter } from 'events';
export interface SaleCompletedEventPayload {
    saleId: string;
    invoiceNumber: string;
    customerId: string | null;
    customerName: string | null;
    customerPhone: string | null;
    total: number;
    paidAmount: number;
    cashierName: string;
    itemsCount: number;
}
export interface SystemAlertEventPayload {
    title: string;
    message: string;
    type: 'LOW_STOCK' | 'EXPIRY_ALERT' | 'SALE_COMPLETED' | 'SYSTEM_ALERT' | 'GENERAL';
    targetRoles?: ('PLATFORM_MANAGER' | 'PHARMACY_MANAGER' | 'ACCOUNTANT' | 'PHARMACIST')[];
    userId?: string;
}
declare class AppEventBus extends EventEmitter {
    emitSaleCompleted(payload: SaleCompletedEventPayload): boolean;
    onSaleCompleted(listener: (payload: SaleCompletedEventPayload) => void): this;
    emitSystemAlert(payload: SystemAlertEventPayload): boolean;
    onSystemAlert(listener: (payload: SystemAlertEventPayload) => void): this;
}
export declare const eventBus: AppEventBus;
export {};
