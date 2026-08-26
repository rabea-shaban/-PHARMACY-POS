import { PaginationMeta } from '../../types/common.types.js';
export interface BatchProductSummary {
    id: string;
    name: string;
    barcode: string;
    category?: {
        id: string;
        name: string;
    };
}
export interface BatchResponse {
    id: string;
    productId: string;
    product?: BatchProductSummary;
    batchNumber: string;
    expiryDate: Date;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    isExpired: boolean;
    daysToExpiry: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBatchInput {
    productId: string;
    batchNumber: string;
    expiryDate: string | Date;
    quantity?: number;
    purchasePrice: number;
    sellingPrice: number;
}
export interface UpdateBatchInput {
    expiryDate?: string | Date;
    purchasePrice?: number;
    sellingPrice?: number;
}
export interface BatchQueryFilters {
    page?: number;
    limit?: number;
    productId?: string;
    batchNumber?: string;
    inStockOnly?: boolean;
    sortBy?: 'expiryDate' | 'quantity' | 'batchNumber' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedBatchesResponse {
    items: BatchResponse[];
    pagination: PaginationMeta;
}
