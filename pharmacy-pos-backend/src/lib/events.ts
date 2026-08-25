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

class AppEventBus extends EventEmitter {
  emitSaleCompleted(payload: SaleCompletedEventPayload): boolean {
    return this.emit('SALE_COMPLETED', payload);
  }

  onSaleCompleted(listener: (payload: SaleCompletedEventPayload) => void): this {
    return this.on('SALE_COMPLETED', listener);
  }

  emitSystemAlert(payload: SystemAlertEventPayload): boolean {
    return this.emit('SYSTEM_ALERT', payload);
  }

  onSystemAlert(listener: (payload: SystemAlertEventPayload) => void): this {
    return this.on('SYSTEM_ALERT', listener);
  }
}

export const eventBus = new AppEventBus();
