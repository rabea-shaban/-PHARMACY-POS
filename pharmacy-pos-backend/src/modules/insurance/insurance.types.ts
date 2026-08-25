import { PaginationMeta } from '../../types/common.types.js';

export interface InsuranceProviderResponse {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  defaultCoveragePercentage: number;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInsuranceResponse {
  id: string;
  customerId: string;
  insuranceProviderId: string;
  insuranceProvider?: InsuranceProviderResponse;
  policyNumber: string;
  memberNumber: string;
  coveragePercentage: number;
  maxCoverageLimit: number | null;
  expiryDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInsuranceProviderInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  defaultCoveragePercentage?: number;
  notes?: string | null;
}

export interface UpdateInsuranceProviderInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  defaultCoveragePercentage?: number;
  notes?: string | null;
  isActive?: boolean;
}

export interface CreateCustomerInsuranceInput {
  customerId: string;
  insuranceProviderId: string;
  policyNumber: string;
  memberNumber: string;
  coveragePercentage?: number;
  maxCoverageLimit?: number | null;
  expiryDate?: string | Date | null;
}

export interface InsuranceQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedInsuranceProvidersResponse {
  items: InsuranceProviderResponse[];
  pagination: PaginationMeta;
}
