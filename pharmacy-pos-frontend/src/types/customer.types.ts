export type CustomerTierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface CustomerTier {
  id: string;
  name: CustomerTierName;
  discountPercentage: number;
  minimumPoints: number;
  description?: string;
}

export interface LoyaltyAccount {
  id: string;
  customerId: string;
  totalPoints: number;
  totalEarned?: number;
  totalRedeemed?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  tierId: string | null;
  tier?: CustomerTier;
  loyaltyAccount?: LoyaltyAccount;
  isActive: boolean;
}
