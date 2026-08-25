export interface CustomerTier {
  id: string;
  name: string;
  discountPercentage: number;
  multiplier: number;
}

export interface CustomerLoyalty {
  id: string;
  points: number;
  lifetimePoints: number;
  totalRedeemed: number;
  tier?: CustomerTier | null;
}

export interface CustomerInsurancePolicy {
  id: string;
  providerId: string;
  providerName: string;
  policyNumber: string;
  coveragePercentage: number;
  maxLimit?: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  isActive: boolean;
  loyalty?: CustomerLoyalty | null;
  insurances?: CustomerInsurancePolicy[];
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
  isActive?: boolean;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
}
