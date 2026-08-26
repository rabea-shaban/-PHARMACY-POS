import { expensesService } from './expenses.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class ExpensesController {
    service;
    constructor(service = expensesService) {
        this.service = service;
    }
    getExpenses = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getExpenses(filters);
            sendSuccess(res, 'Expenses retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getExpenseById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const expense = await this.service.getExpenseById(id);
            sendSuccess(res, 'Expense retrieved successfully', expense, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createExpense = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const expense = await this.service.createExpense(req.body, actorId);
            sendSuccess(res, 'Expense recorded successfully', expense, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateExpense = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const expense = await this.service.updateExpense(id, req.body, actorId);
            sendSuccess(res, 'Expense updated successfully', expense, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteExpense = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const expense = await this.service.deleteExpense(id, actorId);
            sendSuccess(res, 'Expense deleted successfully', expense, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSummary = async (req, res, next) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const summary = await this.service.getSummary(startDate, endDate);
            sendSuccess(res, 'Expenses summary retrieved successfully', summary, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const expensesController = new ExpensesController();
//# sourceMappingURL=expenses.controller.js.map