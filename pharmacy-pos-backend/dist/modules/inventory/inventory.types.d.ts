import { InventoryTransactionType } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';
export interface InventoryTransactionResponse {
    id: string;
    productId: string;
    product?: {
        id: string;
        name: string;
        barcode: string;
    };
    batchId: string | null;
    batch?: {
        id: string;
        batchNumber: string;
        expiryDate: Date;
        quantity: number;
    } | null;
    quantity: number;
    type: InventoryTransactionType;
    referenceType: string | null;
    referenceId: string | null;
    reason: string | null;
    createdById: string | null;
    createdBy?: {
        id: string;
        name: string;
        role: string;
    } | null;
    createdAt: Date;
}
export interface StockAdjustmentInput {
    productId: string;
    batchId: string;
    quantity: number;
    type: InventoryTransactionType;
    reason: string;
    referenceType?: string | null;
    referenceId?: string | null;
}
export interface InventoryTransactionQueryFilters {
    page?: number;
    limit?: number;
    productId?: string;
    batchId?: string;
    type?: InventoryTransactionType;
    startDate?: string | Date;
    endDate?: string | Date;
    sortBy?: 'createdAt' | 'quantity';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedInventoryTransactionsResponse {
    items: InventoryTransactionResponse[];
    pagination: PaginationMeta;
}
