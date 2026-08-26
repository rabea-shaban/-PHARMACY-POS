import { PayrollRepository } from './payroll.repository.js';
import { CommissionsService } from '../commissions/commissions.service.js';
import { UsersService } from '../users/users.service.js';
import { AuditService } from '../audit/audit.service.js';
import { GeneratePayrollDTO, GeneratePeriodPayrollDTO, UpdatePayrollDTO, PayPayrollDTO, PayrollQueryDTO } from './payroll.validator.js';
import { PayrollResponse, PaginatedPayrollResponse, PayrollSummaryResponse } from './payroll.types.js';
export declare class PayrollService {
    private readonly repo;
    private readonly commissions;
    private readonly users;
    private readonly audit;
    constructor(repo?: PayrollRepository, commissions?: CommissionsService, users?: UsersService, audit?: AuditService);
    calculateCommissionForPeriod(userId: string, startDate: Date, endDate: Date): Promise<{
        earned: number;
        reversed: number;
        net: number;
    }>;
    generatePayroll(input: GeneratePayrollDTO, actorId: string): Promise<PayrollResponse>;
    generatePeriodPayroll(input: GeneratePeriodPayrollDTO, actorId: string): Promise<PayrollResponse[]>;
    getPayrolls(filters: PayrollQueryDTO): Promise<PaginatedPayrollResponse>;
    getPayrollById(id: string): Promise<PayrollResponse>;
    getEmployeePayrolls(employeeId: string): Promise<PayrollResponse[]>;
    updatePayroll(id: string, input: UpdatePayrollDTO, actorId: string): Promise<PayrollResponse>;
    approvePayroll(id: string, actorId: string): Promise<PayrollResponse>;
    payPayroll(id: string, input: PayPayrollDTO, actorId: string): Promise<PayrollResponse>;
    cancelPayroll(id: string, actorId: string): Promise<PayrollResponse>;
    getSummary(from?: string, to?: string): Promise<PayrollSummaryResponse>;
}
export declare const payrollService: PayrollService;
