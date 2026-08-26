import { DiscountType } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';
export interface DiscountResponse {
    id: string;
    code: string | null;
    name: string;
    type: DiscountType;
    value: number;
    minimumPurchase: number;
    startDate: Date | null;
    endDate: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateDiscountInput {
    code?: string | null;
    name: string;
    type: DiscountType;
    value: number;
    minimumPurchase?: number;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
}
export interface UpdateDiscountInput {
    code?: string | null;
    name?: string;
    type?: DiscountType;
    value?: number;
    minimumPurchase?: number;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    isActive?: boolean;
}
export interface DiscountQueryFilters {
    page?: number;
    limit?: number;
    search?: string;
    code?: string;
    type?: DiscountType;
    isActive?: boolean;
    sortBy?: 'name' | 'value' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedDiscountsResponse {
    items: DiscountResponse[];
    pagination: PaginationMeta;
}
