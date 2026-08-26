import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApi } from '../api/payrollApi.js';
import {
  PayrollQueryParams,
  GeneratePayrollPayload,
  GeneratePeriodPayrollPayload,
  UpdatePayrollPayload,
  PayPayrollPayload,
} from '../types/payroll.types.js';

export function usePayrollSummary() {
  return useQuery({
    queryKey: ['payroll', 'summary'],
    queryFn: () => payrollApi.getSummary(),
    staleTime: 30 * 1000,
  });
}

export function usePayrolls(params?: PayrollQueryParams) {
  return useQuery({
    queryKey: ['payroll', params],
    queryFn: () => payrollApi.getPayrolls(params),
    staleTime: 20 * 1000,
  });
}

export function usePayroll(id: string) {
  return useQuery({
    queryKey: ['payroll', id],
    queryFn: () => payrollApi.getPayrollById(id),
    enabled: Boolean(id),
  });
}

export function useEmployeePayrolls(employeeId: string) {
  return useQuery({
    queryKey: ['payroll', 'employee', employeeId],
    queryFn: () => payrollApi.getEmployeePayrolls(employeeId),
    enabled: Boolean(employeeId),
  });
}

export function useGeneratePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneratePayrollPayload) => payrollApi.generatePayroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    },
  });
}

export function useGeneratePeriodPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneratePeriodPayrollPayload) =>
      payrollApi.generatePeriodPayroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePayrollPayload }) =>
      payrollApi.updatePayroll(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', variables.id] });
    },
  });
}

export function useApprovePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payrollApi.approvePayroll(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', id] });
    },
  });
}

export function usePayPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayPayrollPayload }) =>
      payrollApi.payPayroll(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useCancelPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payrollApi.cancelPayroll(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', id] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    },
  });
}
