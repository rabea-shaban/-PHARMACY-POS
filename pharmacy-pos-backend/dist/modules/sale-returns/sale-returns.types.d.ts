import { PaginationMeta } from '../../types/common.types.js';
export interface ReturnItemInput {
    saleItemId: string;
    quantity: number;
}
export interface CreateSaleReturnInput {
    saleId: string;
    reason?: string | null;
    items: ReturnItemInput[];
}
export interface SaleReturnItemResponse {
    id: string;
    saleItemId: string;
    productId: string;
    productName: string;
    barcode: string;
    batchId: string | null;
    batchNumber?: string | null;
    quantity: number;
    refundAmount: number;
}
export interface SaleReturnResponse {
    id: string;
    returnNumber: string;
    saleId: string;
    invoiceNumber: string;
    customerId: string | null;
    customerName?: string | null;
    processedById: string;
    processedByName: string;
    reason: string | null;
    subtotal: number;
    tax: number;
    total: number;
    createdAt: Date;
    items: SaleReturnItemResponse[];
}
export interface SaleReturnQueryFilters {
    page?: number;
    limit?: number;
    search?: string;
    returnNumber?: string;
    saleId?: string;
    customerId?: string;
    processedById?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    sortBy?: 'returnNumber' | 'total' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedSaleReturnsResponse {
    items: SaleReturnResponse[];
    pagination: PaginationMeta;
}
