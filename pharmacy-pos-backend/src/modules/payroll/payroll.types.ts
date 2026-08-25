import { PayrollStatus } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface PayrollBreakdown {
  baseSalary: number;
  commissionEarned: number;
  commissionReversed: number;
  netCommission: number;
  bonus: number;
  deductions: number;
  netSalary: number;
}

export interface PayrollResponse {
  id: string;
  userId: string;
  employeeName: string;
  employeePhone: string;
  employeeRole: string;
  periodStart: Date;
  periodEnd: Date;
  baseSalary: number;
  commission: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  breakdown?: PayrollBreakdown;
}

export interface GeneratePayrollInput {
  userId: string;
  periodStart: string | Date;
  periodEnd: string | Date;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
}

export interface GeneratePeriodPayrollInput {
  periodStart: string | Date;
  periodEnd: string | Date;
  defaultBaseSalary?: number;
  staffSalaries?: {
    userId: string;
    baseSalary: number;
    bonus?: number;
    deductions?: number;
  }[];
}

export interface UpdatePayrollInput {
  baseSalary?: number;
  bonus?: number;
  deductions?: number;
}

export interface PayPayrollInput {
  paymentMethod?: 'CASH' | 'VISA' | 'WALLET' | 'OTHER';
  notes?: string;
}

export interface PayrollQueryFilters {
  page?: number;
  limit?: number;
  userId?: string;
  status?: PayrollStatus;
  periodStart?: string | Date;
  periodEnd?: string | Date;
  sortBy?: 'periodStart' | 'netSalary' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPayrollResponse {
  items: PayrollResponse[];
  pagination: PaginationMeta;
}

export interface PayrollSummaryResponse {
  period?: {
    from: string;
    to: string;
  };
  totalEmployeesCount: number;
  totalBaseSalaries: number;
  totalCommissionPaid: number;
  totalBonuses: number;
  totalDeductions: number;
  totalPayrollPayable: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
  statusDistribution: {
    status: PayrollStatus;
    count: number;
    totalNetSalary: number;
  }[];
}
