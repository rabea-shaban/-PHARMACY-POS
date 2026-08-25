import { ExpenseCategory, PaymentMethod } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface ExpenseResponse {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  paymentMethod: PaymentMethod;
  expenseDate: Date;
  createdById: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  amount: number;
  category: ExpenseCategory;
  description: string;
  paymentMethod?: PaymentMethod;
  expenseDate?: string | Date;
}

export interface UpdateExpenseInput {
  amount?: number;
  category?: ExpenseCategory;
  description?: string;
  paymentMethod?: PaymentMethod;
  expenseDate?: string | Date;
}

export interface ExpenseQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  createdById?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  sortBy?: 'amount' | 'expenseDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedExpensesResponse {
  items: ExpenseResponse[];
  pagination: PaginationMeta;
}

export interface ExpenseSummaryResponse {
  totalExpenses: number;
  expensesCount: number;
  categoryBreakdown: {
    category: ExpenseCategory;
    totalAmount: number;
    count: number;
  }[];
  paymentMethodBreakdown: {
    paymentMethod: PaymentMethod;
    totalAmount: number;
    count: number;
  }[];
}
