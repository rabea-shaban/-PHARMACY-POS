import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  Payroll,
  GeneratePayrollPayload,
  GeneratePeriodPayrollPayload,
  UpdatePayrollPayload,
  PayPayrollPayload,
  PayrollQueryParams,
  PayrollSummary,
} from '../types/payroll.types.js';

export const payrollApi = {
  // 1. Get payroll summary and KPIs
  getSummary: async (): Promise<PayrollSummary> => {
    const response = await api.get<ApiResponse<PayrollSummary>>('/payroll/summary');
    return response.data.data;
  },

  // 2. List & filter payroll records with pagination
  getPayrolls: async (params?: PayrollQueryParams): Promise<PaginatedResponse<Payroll>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Payroll>>>('/payroll', {
      params,
    });
    return response.data.data;
  },

  // 3. Get single payroll record details with commission/salary breakdown
  getPayrollById: async (id: string): Promise<Payroll> => {
    const response = await api.get<ApiResponse<Payroll>>(`/payroll/${id}`);
    return response.data.data;
  },

  // 4. Generate payroll for a single employee
  generatePayroll: async (data: GeneratePayrollPayload): Promise<Payroll> => {
    const response = await api.post<ApiResponse<Payroll>>('/payroll/generate', data);
    return response.data.data;
  },

  // 5. Generate period payroll for all active employees
  generatePeriodPayroll: async (data: GeneratePeriodPayrollPayload): Promise<{ count: number; items: Payroll[] }> => {
    const response = await api.post<ApiResponse<{ count: number; items: Payroll[] }>>(
      '/payroll/generate-period',
      data
    );
    return response.data.data;
  },

  // 6. Update draft/pending payroll components
  updatePayroll: async (id: string, data: UpdatePayrollPayload): Promise<Payroll> => {
    const response = await api.patch<ApiResponse<Payroll>>(`/payroll/${id}`, data);
    return response.data.data;
  },

  // 7. Approve payroll (DRAFT -> PENDING)
  approvePayroll: async (id: string): Promise<Payroll> => {
    const response = await api.post<ApiResponse<Payroll>>(`/payroll/${id}/approve`);
    return response.data.data;
  },

  // 8. Pay payroll (PENDING -> PAID)
  payPayroll: async (id: string, data: PayPayrollPayload): Promise<Payroll> => {
    const response = await api.post<ApiResponse<Payroll>>(`/payroll/${id}/pay`, data);
    return response.data.data;
  },

  // 9. Cancel payroll
  cancelPayroll: async (id: string): Promise<Payroll> => {
    const response = await api.post<ApiResponse<Payroll>>(`/payroll/${id}/cancel`);
    return response.data.data;
  },

  // 10. Get history of payrolls for specific employee
  getEmployeePayrolls: async (employeeId: string): Promise<Payroll[]> => {
    const response = await api.get<ApiResponse<Payroll[]>>(`/payroll/employee/${employeeId}`);
    return response.data.data;
  },
};
