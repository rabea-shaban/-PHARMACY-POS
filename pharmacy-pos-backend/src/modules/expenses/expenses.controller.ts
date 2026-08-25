import { Request, Response, NextFunction } from 'express';
import { expensesService, ExpensesService } from './expenses.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { ExpenseQueryFilters } from './expenses.types.js';

export class ExpensesController {
  constructor(private readonly service: ExpensesService = expensesService) {}

  getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as ExpenseQueryFilters;
      const result = await this.service.getExpenses(filters);
      sendSuccess(res, 'Expenses retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getExpenseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const expense = await this.service.getExpenseById(id);
      sendSuccess(res, 'Expense retrieved successfully', expense, 200);
    } catch (error) {
      next(error);
    }
  };

  createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id as string;
      const expense = await this.service.createExpense(req.body, actorId);
      sendSuccess(res, 'Expense recorded successfully', expense, 201);
    } catch (error) {
      next(error);
    }
  };

  updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const expense = await this.service.updateExpense(id, req.body, actorId);
      sendSuccess(res, 'Expense updated successfully', expense, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const expense = await this.service.deleteExpense(id, actorId);
      sendSuccess(res, 'Expense deleted successfully', expense, 200);
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const summary = await this.service.getSummary(startDate, endDate);
      sendSuccess(res, 'Expenses summary retrieved successfully', summary, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const expensesController = new ExpensesController();
