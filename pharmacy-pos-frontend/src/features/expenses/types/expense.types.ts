import { PaymentMethod } from '../../sales/types/sale.types.js';

export type ExpenseCategory =
  | 'RENT'
  | 'ELECTRICITY'
  | 'MAINTENANCE'
  | 'SUPPLIES'
  | 'SALARY'
  | 'OTHER';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  paymentMethod: PaymentMethod;
  expenseDate: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  amount: number;
  category: ExpenseCategory;
  description: string;
  paymentMethod?: PaymentMethod;
  expenseDate?: string;
}

export interface UpdateExpensePayload {
  amount?: number;
  category?: ExpenseCategory;
  description?: string;
  paymentMethod?: PaymentMethod;
  expenseDate?: string;
}

export interface ExpenseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  createdById?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'amount' | 'expenseDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryBreakdownItem {
  category: ExpenseCategory;
  totalAmount: number;
  count: number;
}

export interface PaymentMethodBreakdownItem {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  count: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  expensesCount: number;
  categoryBreakdown: CategoryBreakdownItem[];
  paymentMethodBreakdown: PaymentMethodBreakdownItem[];
}
