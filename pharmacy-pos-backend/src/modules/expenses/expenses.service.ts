import { expensesRepository, ExpensesRepository } from './expenses.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { CreateExpenseDTO, UpdateExpenseDTO } from './expenses.validator.js';
import {
  ExpenseResponse,
  ExpenseQueryFilters,
  PaginatedExpensesResponse,
  ExpenseSummaryResponse,
} from './expenses.types.js';
import { NotFoundError } from '../../utils/errors.js';

function formatExpense(raw: any): ExpenseResponse {
  return {
    id: raw.id,
    amount: Number(raw.amount),
    category: raw.category,
    description: raw.description,
    paymentMethod: raw.paymentMethod,
    expenseDate: raw.expenseDate,
    createdById: raw.createdById,
    createdByName: raw.createdBy?.name || 'Staff',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class ExpensesService {
  constructor(
    private readonly repo: ExpensesRepository = expensesRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async getExpenses(filters: ExpenseQueryFilters): Promise<PaginatedExpensesResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatExpense),
      pagination,
    };
  }

  async getExpenseById(id: string): Promise<ExpenseResponse> {
    const expense = await this.repo.findById(id);
    if (!expense) {
      throw new NotFoundError(`Expense with ID '${id}' not found`);
    }
    return formatExpense(expense);
  }

  async createExpense(input: CreateExpenseDTO, actorId: string): Promise<ExpenseResponse> {
    const created = await this.repo.create({
      amount: input.amount,
      category: input.category,
      description: input.description.trim(),
      paymentMethod: input.paymentMethod || 'CASH',
      expenseDate: input.expenseDate ? new Date(input.expenseDate) : new Date(),
      createdById: actorId,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId,
      action: 'CREATE',
      entity: 'expenses',
      entityId: created.id,
      newData: { category: created.category, amount: input.amount, description: input.description },
    });

    return formatExpense(created);
  }

  async updateExpense(id: string, input: UpdateExpenseDTO, actorId: string): Promise<ExpenseResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Expense with ID '${id}' not found`);
    }

    const updateData: any = {};
    if (input.amount !== undefined) updateData.amount = input.amount;
    if (input.category) updateData.category = input.category;
    if (input.description) updateData.description = input.description.trim();
    if (input.paymentMethod) updateData.paymentMethod = input.paymentMethod;
    if (input.expenseDate) updateData.expenseDate = new Date(input.expenseDate);

    const updated = await this.repo.update(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId,
      action: 'UPDATE',
      entity: 'expenses',
      entityId: id,
      oldData: { amount: Number(existing.amount), category: existing.category },
      newData: { amount: Number(updated.amount), category: updated.category },
    });

    return formatExpense(updated);
  }

  async deleteExpense(id: string, actorId: string): Promise<ExpenseResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Expense with ID '${id}' not found`);
    }

    const deleted = await this.repo.delete(id);

    // Record audit log
    await this.audit.logAction({
      userId: actorId,
      action: 'DELETE',
      entity: 'expenses',
      entityId: id,
      metadata: { description: existing.description, amount: Number(existing.amount) },
    });

    return formatExpense(deleted);
  }

  async getSummary(startDate?: string, endDate?: string): Promise<ExpenseSummaryResponse> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.repo.getSummary(start, end);
  }
}

export const expensesService = new ExpensesService();
