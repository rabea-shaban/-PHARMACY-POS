import { Prisma, PayrollStatus, PaymentMethod } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { PayrollQueryFilters } from './payroll.types.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../utils/errors.js';

export class PayrollRepository {
  private readonly defaultInclude = {
    user: {
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
      },
    },
  };

  async findMany(filters: PayrollQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { userId, status, periodStart, periodEnd, sortBy = 'periodStart', sortOrder = 'desc' } = filters;

    const where: Prisma.PayrollWhereInput = {};

    if (userId) where.userId = userId;
    if (status) where.status = status;

    if (periodStart || periodEnd) {
      where.AND = [
        ...(periodStart ? [{ periodEnd: { gte: new Date(periodStart) } }] : []),
        ...(periodEnd ? [{ periodStart: { lte: new Date(periodEnd) } }] : []),
      ];
    }

    const [items, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.payroll.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.payroll.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findByEmployeeAndPeriod(userId: string, periodStart: Date, periodEnd: Date) {
    return prisma.payroll.findFirst({
      where: {
        userId,
        status: { not: 'CANCELLED' },
        periodStart: { lte: periodEnd },
        periodEnd: { gte: periodStart },
      },
      include: this.defaultInclude,
    });
  }

  async findByEmployeeId(userId: string) {
    return prisma.payroll.findMany({
      where: { userId },
      include: this.defaultInclude,
      orderBy: { periodStart: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    baseSalary: number;
    commission: number;
    bonus: number;
    deductions: number;
    netSalary: number;
    periodStart: Date;
    periodEnd: Date;
    status?: PayrollStatus;
  }) {
    return prisma.payroll.create({
      data: {
        userId: data.userId,
        baseSalary: data.baseSalary,
        commission: data.commission,
        bonus: data.bonus,
        deductions: data.deductions,
        netSalary: data.netSalary,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        status: data.status || PayrollStatus.DRAFT,
      },
      include: this.defaultInclude,
    });
  }

  async update(
    id: string,
    data: {
      baseSalary?: number;
      commission?: number;
      bonus?: number;
      deductions?: number;
      netSalary?: number;
      status?: PayrollStatus;
      paidAt?: Date | null;
    }
  ) {
    return prisma.payroll.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }

  async delete(id: string) {
    return prisma.payroll.delete({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async payPayrollAtomic(
    payrollId: string,
    paymentMethod: PaymentMethod = 'CASH',
    actorId: string,
    notes?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const payroll = await tx.payroll.findUnique({
        where: { id: payrollId },
        include: { user: true },
      });

      if (!payroll) {
        throw new NotFoundError(`Payroll record with ID '${payrollId}' not found`);
      }

      if (payroll.status === PayrollStatus.PAID) {
        throw new ConflictError(`Payroll for '${payroll.user.name}' has already been paid on ${payroll.paidAt?.toISOString()}`);
      }

      if (payroll.status === PayrollStatus.CANCELLED) {
        throw new BadRequestError(`Cannot pay a cancelled payroll record`);
      }

      const now = new Date();

      // 1. Mark Payroll as PAID
      const updatedPayroll = await tx.payroll.update({
        where: { id: payrollId },
        data: {
          status: PayrollStatus.PAID,
          paidAt: now,
        },
        include: this.defaultInclude,
      });

      // 2. Record Operating Expense under category SALARY
      await tx.expense.create({
        data: {
          amount: payroll.netSalary,
          category: 'SALARY',
          description: `Payroll settlement for ${payroll.user.name} (${payroll.periodStart.toISOString().slice(0, 10)} to ${payroll.periodEnd.toISOString().slice(0, 10)})${notes ? ': ' + notes : ''}`,
          paymentMethod,
          expenseDate: now,
          createdById: actorId,
        },
      });

      // 3. Create AuditLog
      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: 'UPDATE',
          entity: 'payrolls',
          entityId: payrollId,
          newData: JSON.stringify({
            status: 'PAID',
            paidAt: now.toISOString(),
            netSalary: Number(payroll.netSalary),
            employeeName: payroll.user.name,
            paymentMethod,
          }),
        },
      });

      return updatedPayroll;
    });
  }

  async getSummary(startDate?: Date, endDate?: Date) {
    const where: Prisma.PayrollWhereInput = {
      ...(startDate || endDate
        ? {
            AND: [
              ...(startDate ? [{ periodEnd: { gte: startDate } }] : []),
              ...(endDate ? [{ periodStart: { lte: endDate } }] : []),
            ],
          }
        : {}),
    };

    const payrolls = await prisma.payroll.findMany({
      where,
      include: this.defaultInclude,
    });

    let totalBaseSalaries = 0;
    let totalCommissionPaid = 0;
    let totalBonuses = 0;
    let totalDeductions = 0;
    let totalPayrollPayable = 0;
    let totalPaidAmount = 0;
    let totalPendingAmount = 0;

    const statusMap = new Map<PayrollStatus, { status: PayrollStatus; count: number; totalNetSalary: number }>();
    const employeesSet = new Set<string>();

    for (const p of payrolls) {
      employeesSet.add(p.userId);
      const base = Number(p.baseSalary);
      const comm = Number(p.commission);
      const bon = Number(p.bonus);
      const ded = Number(p.deductions);
      const net = Number(p.netSalary);

      totalBaseSalaries += base;
      totalCommissionPaid += comm;
      totalBonuses += bon;
      totalDeductions += ded;
      totalPayrollPayable += net;

      if (p.status === PayrollStatus.PAID) {
        totalPaidAmount += net;
      } else if (p.status === PayrollStatus.PENDING || p.status === PayrollStatus.DRAFT) {
        totalPendingAmount += net;
      }

      const sEntry = statusMap.get(p.status) || { status: p.status, count: 0, totalNetSalary: 0 };
      sEntry.count++;
      sEntry.totalNetSalary += net;
      statusMap.set(p.status, sEntry);
    }

    return {
      totalEmployeesCount: employeesSet.size,
      totalBaseSalaries: Number(totalBaseSalaries.toFixed(2)),
      totalCommissionPaid: Number(totalCommissionPaid.toFixed(2)),
      totalBonuses: Number(totalBonuses.toFixed(2)),
      totalDeductions: Number(totalDeductions.toFixed(2)),
      totalPayrollPayable: Number(totalPayrollPayable.toFixed(2)),
      totalPaidAmount: Number(totalPaidAmount.toFixed(2)),
      totalPendingAmount: Number(totalPendingAmount.toFixed(2)),
      statusDistribution: Array.from(statusMap.values()).map((s) => ({
        ...s,
        totalNetSalary: Number(s.totalNetSalary.toFixed(2)),
      })),
    };
  }
}

export const payrollRepository = new PayrollRepository();
