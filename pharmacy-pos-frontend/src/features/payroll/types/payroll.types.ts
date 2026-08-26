export type PayrollStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'VISA' | 'WALLET' | 'OTHER';

export interface PayrollBreakdown {
  baseSalary: number;
  commissionEarned: number;
  commissionReversed: number;
  netCommission: number;
  bonus: number;
  deductions: number;
  netSalary: number;
}

export interface Payroll {
  id: string;
  userId: string;
  employeeName: string;
  employeePhone: string;
  employeeRole: string;
  periodStart: string;
  periodEnd: string;
  baseSalary: number;
  commission: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  breakdown?: PayrollBreakdown;
}

export interface GeneratePayrollPayload {
  userId: string;
  periodStart: string;
  periodEnd: string;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
}

export interface GeneratePeriodPayrollPayload {
  periodStart: string;
  periodEnd: string;
  defaultBaseSalary?: number;
  staffSalaries?: {
    userId: string;
    baseSalary: number;
    bonus?: number;
    deductions?: number;
  }[];
}

export interface UpdatePayrollPayload {
  baseSalary?: number;
  bonus?: number;
  deductions?: number;
}

export interface PayPayrollPayload {
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface PayrollQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: PayrollStatus;
  periodStart?: string;
  periodEnd?: string;
  sortBy?: 'periodStart' | 'netSalary' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PayrollSummary {
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
