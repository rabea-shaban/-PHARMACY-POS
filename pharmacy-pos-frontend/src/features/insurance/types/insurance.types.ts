import { PaginationMeta } from '../../../types/api.types.js';

export interface InsuranceProvider {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  defaultCoveragePercentage: number;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    customerInsurances?: number;
    saleInsurances?: number;
  };
}

export interface CustomerInsurance {
  id: string;
  customerId: string;
  insuranceProviderId: string;
  insuranceProvider?: InsuranceProvider;
  policyNumber: string;
  memberNumber: string;
  coveragePercentage: number;
  maxCoverageLimit: number | null;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInsuranceProviderDTO {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  defaultCoveragePercentage?: number;
  notes?: string | null;
}

export interface UpdateInsuranceProviderDTO {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  defaultCoveragePercentage?: number;
  notes?: string | null;
  isActive?: boolean;
}

export interface CreateCustomerInsuranceDTO {
  customerId: string;
  insuranceProviderId: string;
  policyNumber: string;
  memberNumber: string;
  coveragePercentage?: number;
  maxCoverageLimit?: number | null;
  expiryDate?: string | null;
}

export interface InsuranceQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginatedInsuranceProvidersResponse {
  items: InsuranceProvider[];
  pagination: PaginationMeta;
}

export interface InsuranceClaimRecord {
  saleId: string;
  invoiceNumber: string;
  saleDate: string;
  customerName: string;
  customerPhone?: string;
  providerName: string;
  claimReference: string;
  coveredAmount: number;
  customerAmount: number;
  coveragePercentage: number;
  totalSaleAmount: number;
  cashierName?: string;
}
