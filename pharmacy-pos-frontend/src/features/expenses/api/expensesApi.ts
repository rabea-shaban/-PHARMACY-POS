import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  Expense,
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseQueryParams,
  ExpenseSummary,
} from '../types/expense.types.js';

export const expensesApi = {
  // 1. Get list of expenses with filters and pagination
  getExpenses: async (params?: ExpenseQueryParams): Promise<PaginatedResponse<Expense>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Expense>>>('/expenses', { params });
    return response.data.data;
  },

  // 2. Get financial summary of operating expenses
  getExpenseSummary: async (params?: { startDate?: string; endDate?: string }): Promise<ExpenseSummary> => {
    const response = await api.get<ApiResponse<ExpenseSummary>>('/expenses/summary', { params });
    return response.data.data;
  },

  // 3. Get single expense details by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
    return response.data.data;
  },

  // 4. Record new operating expense
  createExpense: async (data: CreateExpensePayload): Promise<Expense> => {
    const response = await api.post<ApiResponse<Expense>>('/expenses', data);
    return response.data.data;
  },

  // 5. Update expense
  updateExpense: async (id: string, data: UpdateExpensePayload): Promise<Expense> => {
    const response = await api.patch<ApiResponse<Expense>>(`/expenses/${id}`, data);
    return response.data.data;
  },

  // 6. Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/expenses/${id}`);
  },
};
