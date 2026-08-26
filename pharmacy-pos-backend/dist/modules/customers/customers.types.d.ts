import { Gender } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';
export interface CustomerSummary {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    notes: string | null;
    dateOfBirth: Date | null;
    gender: Gender | null;
    tierId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CustomerTierInfo {
    id: string;
    name: string;
    discountPercentage: number;
    minimumPoints: number;
    description: string | null;
}
export interface CustomerLoyaltyInfo {
    id: string;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CustomerProfileResponse extends CustomerSummary {
    tier: CustomerTierInfo | null;
    loyaltyAccount: CustomerLoyaltyInfo | null;
}
export interface CreateCustomerInput {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    dateOfBirth?: string | Date | null;
    gender?: Gender | null;
    tierId?: string | null;
}
export interface UpdateCustomerInput {
    name?: string;
    phone?: string;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    dateOfBirth?: string | Date | null;
    gender?: Gender | null;
    tierId?: string | null;
    isActive?: boolean;
}
export interface CustomerQueryFilters {
    page?: number;
    limit?: number;
    search?: string;
    phone?: string;
    name?: string;
    tierId?: string;
    isActive?: boolean;
    sortBy?: 'name' | 'phone' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedCustomersResponse {
    items: CustomerProfileResponse[];
    pagination: PaginationMeta;
}
export interface CustomerPurchaseItem {
    id: string;
    invoiceNumber: string;
    saleDate: Date;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paidAmount: number;
    remainingAmount: number;
    status: string;
}
export interface PaginatedCustomerPurchasesResponse {
    items: CustomerPurchaseItem[];
    pagination: PaginationMeta;
}
