import { payrollRepository } from './payroll.repository.js';
import { commissionsService } from '../commissions/commissions.service.js';
import { usersService } from '../users/users.service.js';
import { auditService } from '../audit/audit.service.js';
import { parseDateRange } from '../../utils/date.util.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../utils/errors.js';
import { PayrollStatus } from '@prisma/client';
function formatPayroll(raw) {
    const baseSalary = Number(raw.baseSalary);
    const commission = Number(raw.commission);
    const bonus = Number(raw.bonus);
    const deductions = Number(raw.deductions);
    const netSalary = Number(raw.netSalary);
    return {
        id: raw.id,
        userId: raw.userId,
        employeeName: raw.user?.name || 'Staff',
        employeePhone: raw.user?.phone || '',
        employeeRole: raw.user?.role || 'PHARMACIST',
        periodStart: raw.periodStart,
        periodEnd: raw.periodEnd,
        baseSalary,
        commission,
        bonus,
        deductions,
        netSalary,
        status: raw.status,
        paidAt: raw.paidAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        breakdown: {
            baseSalary,
            commissionEarned: commission,
            commissionReversed: 0,
            netCommission: commission,
            bonus,
            deductions,
            netSalary,
        },
    };
}
export class PayrollService {
    repo;
    commissions;
    users;
    audit;
    constructor(repo = payrollRepository, commissions = commissionsService, users = usersService, audit = auditService) {
        this.repo = repo;
        this.commissions = commissions;
        this.users = users;
        this.audit = audit;
    }
    async calculateCommissionForPeriod(userId, startDate, endDate) {
        const transactions = await this.commissions.getStaffTransactions(userId, {
            startDate,
            endDate,
            limit: 1000,
        });
        let earned = 0;
        let reversed = 0;
        for (const tx of transactions.items) {
            if (tx.commissionAmount > 0) {
                earned += tx.commissionAmount;
            }
            else {
                reversed += Math.abs(tx.commissionAmount);
            }
        }
        const net = Number(Math.max(0, earned - reversed).toFixed(2));
        return {
            earned: Number(earned.toFixed(2)),
            reversed: Number(reversed.toFixed(2)),
            net,
        };
    }
    async generatePayroll(input, actorId) {
        const user = await this.users.getUserById(input.userId);
        if (!user) {
            throw new NotFoundError(`Employee with ID '${input.userId}' not found`);
        }
        if (!user.isActive) {
            throw new BadRequestError(`Cannot generate payroll for deactivated employee '${user.name}'`);
        }
        const { startDate, endDate } = parseDateRange(input.periodStart, input.periodEnd);
        // Check for duplicate active payroll in overlapping period
        const existing = await this.repo.findByEmployeeAndPeriod(input.userId, startDate, endDate);
        if (existing) {
            throw new ConflictError(`Active payroll already exists for '${user.name}' in the period ${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)} (ID: ${existing.id}, Status: ${existing.status})`);
        }
        // Authoritatively calculate commission for the period
        const comm = await this.calculateCommissionForPeriod(input.userId, startDate, endDate);
        const baseSalary = Number(input.baseSalary.toFixed(2));
        const bonus = Number((input.bonus || 0).toFixed(2));
        const deductions = Number((input.deductions || 0).toFixed(2));
        const netSalary = Number((baseSalary + comm.net + bonus - deductions).toFixed(2));
        const created = await this.repo.create({
            userId: input.userId,
            baseSalary,
            commission: comm.net,
            bonus,
            deductions,
            netSalary,
            periodStart: startDate,
            periodEnd: endDate,
            status: PayrollStatus.PENDING,
        });
        // Record audit log
        await this.audit.logAction({
            userId: actorId,
            action: 'CREATE',
            entity: 'payrolls',
            entityId: created.id,
            newData: {
                employeeName: user.name,
                baseSalary,
                netCommission: comm.net,
                bonus,
                deductions,
                netSalary,
                period: `${input.periodStart} to ${input.periodEnd}`,
            },
        });
        const response = formatPayroll(created);
        response.breakdown = {
            baseSalary,
            commissionEarned: comm.earned,
            commissionReversed: comm.reversed,
            netCommission: comm.net,
            bonus,
            deductions,
            netSalary,
        };
        return response;
    }
    async generatePeriodPayroll(input, actorId) {
        const { startDate, endDate } = parseDateRange(input.periodStart, input.periodEnd);
        const allUsers = await this.users.getUsers({ limit: 100, isActive: true });
        const salaryMap = new Map();
        if (input.staffSalaries) {
            for (const s of input.staffSalaries) {
                salaryMap.set(s.userId, s);
            }
        }
        const generated = [];
        for (const u of allUsers.items) {
            // Check if existing payroll exists
            const existing = await this.repo.findByEmployeeAndPeriod(u.id, startDate, endDate);
            if (existing)
                continue; // Skip already generated
            const override = salaryMap.get(u.id);
            const baseSalary = override?.baseSalary ?? input.defaultBaseSalary ?? 5000;
            const bonus = override?.bonus ?? 0;
            const deductions = override?.deductions ?? 0;
            const comm = await this.calculateCommissionForPeriod(u.id, startDate, endDate);
            const netSalary = Number((baseSalary + comm.net + bonus - deductions).toFixed(2));
            const created = await this.repo.create({
                userId: u.id,
                baseSalary,
                commission: comm.net,
                bonus,
                deductions,
                netSalary,
                periodStart: startDate,
                periodEnd: endDate,
                status: PayrollStatus.PENDING,
            });
            generated.push(formatPayroll(created));
        }
        await this.audit.logAction({
            userId: actorId,
            action: 'CREATE',
            entity: 'payrolls',
            metadata: { generatedCount: generated.length, period: `${input.periodStart} to ${input.periodEnd}` },
        });
        return generated;
    }
    async getPayrolls(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const queryFilters = {
            page,
            limit,
            userId: filters.userId,
            status: filters.status,
            periodStart: filters.periodStart || filters.from,
            periodEnd: filters.periodEnd || filters.to,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };
        const { items, total } = await this.repo.findMany(queryFilters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatPayroll),
            pagination,
        };
    }
    async getPayrollById(id) {
        const payroll = await this.repo.findById(id);
        if (!payroll) {
            throw new NotFoundError(`Payroll record with ID '${id}' not found`);
        }
        const comm = await this.calculateCommissionForPeriod(payroll.userId, new Date(payroll.periodStart), new Date(payroll.periodEnd));
        const response = formatPayroll(payroll);
        response.breakdown = {
            baseSalary: Number(payroll.baseSalary),
            commissionEarned: comm.earned,
            commissionReversed: comm.reversed,
            netCommission: Number(payroll.commission),
            bonus: Number(payroll.bonus),
            deductions: Number(payroll.deductions),
            netSalary: Number(payroll.netSalary),
        };
        return response;
    }
    async getEmployeePayrolls(employeeId) {
        const payrolls = await this.repo.findByEmployeeId(employeeId);
        return payrolls.map(formatPayroll);
    }
    async updatePayroll(id, input, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Payroll record with ID '${id}' not found`);
        }
        if (existing.status === PayrollStatus.PAID) {
            throw new ConflictError(`Cannot modify a paid payroll record. Historical paid records are immutable.`);
        }
        if (existing.status === PayrollStatus.CANCELLED) {
            throw new BadRequestError(`Cannot modify a cancelled payroll record.`);
        }
        const baseSalary = input.baseSalary !== undefined ? input.baseSalary : Number(existing.baseSalary);
        const bonus = input.bonus !== undefined ? input.bonus : Number(existing.bonus);
        const deductions = input.deductions !== undefined ? input.deductions : Number(existing.deductions);
        const commission = Number(existing.commission);
        const netSalary = Number((baseSalary + commission + bonus - deductions).toFixed(2));
        const updated = await this.repo.update(id, {
            baseSalary,
            bonus,
            deductions,
            netSalary,
        });
        await this.audit.logAction({
            userId: actorId,
            action: 'UPDATE',
            entity: 'payrolls',
            entityId: id,
            oldData: { netSalary: Number(existing.netSalary), bonus: Number(existing.bonus), deductions: Number(existing.deductions) },
            newData: { netSalary, bonus, deductions },
        });
        return formatPayroll(updated);
    }
    async approvePayroll(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Payroll record with ID '${id}' not found`);
        }
        if (existing.status === PayrollStatus.PAID) {
            throw new ConflictError(`Payroll has already been paid.`);
        }
        const updated = await this.repo.update(id, {
            status: PayrollStatus.PENDING,
        });
        await this.audit.logAction({
            userId: actorId,
            action: 'UPDATE',
            entity: 'payrolls',
            entityId: id,
            metadata: { action: 'APPROVED', previousStatus: existing.status },
        });
        return formatPayroll(updated);
    }
    async payPayroll(id, input, actorId) {
        const paid = await this.repo.payPayrollAtomic(id, input.paymentMethod || 'CASH', actorId, input.notes);
        return formatPayroll(paid);
    }
    async cancelPayroll(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Payroll record with ID '${id}' not found`);
        }
        if (existing.status === PayrollStatus.PAID) {
            throw new ConflictError(`Cannot cancel a paid payroll record.`);
        }
        const updated = await this.repo.update(id, {
            status: PayrollStatus.CANCELLED,
        });
        await this.audit.logAction({
            userId: actorId,
            action: 'UPDATE',
            entity: 'payrolls',
            entityId: id,
            metadata: { action: 'CANCELLED', previousStatus: existing.status },
        });
        return formatPayroll(updated);
    }
    async getSummary(from, to) {
        let startDate;
        let endDate;
        if (from || to) {
            const parsed = parseDateRange(from, to);
            startDate = parsed.startDate;
            endDate = parsed.endDate;
        }
        const summary = await this.repo.getSummary(startDate, endDate);
        return {
            ...(from || to ? { period: { from: from || '', to: to || '' } } : {}),
            ...summary,
        };
    }
}
export const payrollService = new PayrollService();
//# sourceMappingURL=payroll.service.js.map