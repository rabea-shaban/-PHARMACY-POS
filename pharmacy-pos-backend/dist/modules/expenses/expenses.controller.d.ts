import { Request, Response, NextFunction } from 'express';
import { ExpensesService } from './expenses.service.js';
export declare class ExpensesController {
    private readonly service;
    constructor(service?: ExpensesService);
    getExpenses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpenseById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createExpense: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateExpense: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteExpense: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const expensesController: ExpensesController;
