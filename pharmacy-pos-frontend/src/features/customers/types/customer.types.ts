export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface CustomerTier {
  id: string;
  name: string;
  discountPercentage: number;
  minimumPoints: number;
  description?: string | null;
  isActive?: boolean;
}

export interface CustomerLoyaltyAccount {
  id: string;
  customerId?: string;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInsurancePolicy {
  id: string;
  providerId: string;
  providerName: string;
  policyNumber: string;
  coveragePercentage: number;
  maxLimit?: number | null;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tierId?: string | null;
  tier?: CustomerTier | null;
  loyaltyAccount?: CustomerLoyaltyAccount | null;
  loyalty?: {
    points: number;
    lifetimePoints?: number;
    totalRedeemed?: number;
    tier?: CustomerTier | null;
  } | null;
  insurances?: CustomerInsurancePolicy[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sales: number;
  };
}

export interface CustomerQueryParams {
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

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tierId?: string | null;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tierId?: string | null;
  isActive?: boolean;
}

export interface CustomerPurchaseItem {
  id: string;
  invoiceNumber: string;
  saleDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
}

export interface CustomerPurchasesQueryParams {
  page?: number;
  limit?: number;
}
