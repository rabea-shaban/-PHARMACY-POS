import { CustomerTier } from './customer.types.js';

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'ADJUSTMENT' | 'EXPIRED' | 'REVERSAL';

export interface LoyaltyTransactionItem {
  id: string;
  points: number;
  balanceAfter: number;
  type: LoyaltyTransactionType;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface LoyaltySummaryResponse {
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  tier: CustomerTier | null;
  loyaltyAccount: {
    id: string;
    customerId: string;
    totalPoints: number;
    createdAt: string;
    updatedAt: string;
  };
  recentTransactions: LoyaltyTransactionItem[];
}

export interface AdjustPointsPayload {
  points: number;
  reason: string;
  referenceType?: string | null;
  referenceId?: string | null;
}

export interface LoyaltyTransactionQueryParams {
  page?: number;
  limit?: number;
  type?: LoyaltyTransactionType;
  sortBy?: 'createdAt' | 'points';
  sortOrder?: 'asc' | 'desc';
}
