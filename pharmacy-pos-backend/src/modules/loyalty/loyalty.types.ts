import { LoyaltyTransactionType } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface CustomerTierResponse {
  id: string;
  name: string;
  discountPercentage: number;
  minimumPoints: number;
  description: string | null;
  isActive: boolean;
}

export interface LoyaltyAccountSummary {
  id: string;
  customerId: string;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTransactionItem {
  id: string;
  points: number;
  balanceAfter: number;
  type: LoyaltyTransactionType;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  createdAt: Date;
}

export interface LoyaltySummaryResponse {
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  tier: CustomerTierResponse | null;
  loyaltyAccount: LoyaltyAccountSummary;
  recentTransactions: LoyaltyTransactionItem[];
}

export interface PaginatedLoyaltyTransactionsResponse {
  items: LoyaltyTransactionItem[];
  pagination: PaginationMeta;
}

export interface EarnPointsInput {
  points: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
}

export interface RedeemPointsInput {
  points: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
}

export interface AdjustPointsInput {
  points: number;
  reason: string;
  referenceType?: string | null;
  referenceId?: string | null;
}

export interface LoyaltyTransactionQueryFilters {
  page?: number;
  limit?: number;
  type?: LoyaltyTransactionType;
  sortBy?: 'createdAt' | 'points';
  sortOrder?: 'asc' | 'desc';
}
