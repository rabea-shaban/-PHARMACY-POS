import { Router } from 'express';
import { expensesController } from './expenses.controller.js';
import { createExpenseSchema, updateExpenseSchema, expenseQuerySchema, expenseIdParamSchema, } from './expenses.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const expensesRouter = Router();
// Staff authentication required for all expense endpoints
expensesRouter.use(authenticate);
// GET /api/v1/expenses/summary - Financial summary of operating expenses (Managers & Accountants)
expensesRouter.get('/summary', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), expensesController.getSummary);
// GET /api/v1/expenses - List & filter operating expenses (Managers & Accountants)
expensesRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), validateQuery(expenseQuerySchema), expensesController.getExpenses);
// GET /api/v1/expenses/:id - Get expense details (Managers & Accountants)
expensesRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), validateParams(expenseIdParamSchema), expensesController.getExpenseById);
// POST /api/v1/expenses - Record new operating expense (Managers & Accountants)
expensesRouter.post('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), validateBody(createExpenseSchema), expensesController.createExpense);
// PATCH /api/v1/expenses/:id - Update expense (Managers only)
expensesRouter.patch('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(expenseIdParamSchema), validateBody(updateExpenseSchema), expensesController.updateExpense);
// DELETE /api/v1/expenses/:id - Delete expense (Managers only)
expensesRouter.delete('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(expenseIdParamSchema), expensesController.deleteExpense);
//# sourceMappingURL=expenses.routes.js.map