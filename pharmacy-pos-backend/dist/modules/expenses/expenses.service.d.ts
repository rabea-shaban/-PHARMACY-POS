import { ExpensesRepository } from './expenses.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateExpenseDTO, UpdateExpenseDTO } from './expenses.validator.js';
import { ExpenseResponse, ExpenseQueryFilters, PaginatedExpensesResponse, ExpenseSummaryResponse } from './expenses.types.js';
export declare class ExpensesService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: ExpensesRepository, audit?: AuditService);
    getExpenses(filters: ExpenseQueryFilters): Promise<PaginatedExpensesResponse>;
    getExpenseById(id: string): Promise<ExpenseResponse>;
    createExpense(input: CreateExpenseDTO, actorId: string): Promise<ExpenseResponse>;
    updateExpense(id: string, input: UpdateExpenseDTO, actorId: string): Promise<ExpenseResponse>;
    deleteExpense(id: string, actorId: string): Promise<ExpenseResponse>;
    getSummary(startDate?: string, endDate?: string): Promise<ExpenseSummaryResponse>;
}
export declare const expensesService: ExpensesService;
