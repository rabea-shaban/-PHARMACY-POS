import { Router } from 'express';
import { commissionsController } from './commissions.controller.js';
import { createCommissionRuleSchema, updateCommissionRuleSchema, commissionTransactionQuerySchema, commissionRuleIdParamSchema, userIdParamSchema, } from './commissions.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const commissionsRouter = Router();
// Staff authentication required for all commission endpoints
commissionsRouter.use(authenticate);
// GET /api/v1/commissions/rules - List commission rules (Managers & Accountants)
commissionsRouter.get('/rules', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), commissionsController.getRules);
// POST /api/v1/commissions/rules - Create commission rule (Managers only)
commissionsRouter.post('/rules', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateBody(createCommissionRuleSchema), commissionsController.createRule);
// PATCH /api/v1/commissions/rules/:id - Update commission rule (Managers only)
commissionsRouter.patch('/rules/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(commissionRuleIdParamSchema), validateBody(updateCommissionRuleSchema), commissionsController.updateRule);
// GET /api/v1/commissions/transactions - Query commission transactions (Managers & Accountants)
commissionsRouter.get('/transactions', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), validateQuery(commissionTransactionQuerySchema), commissionsController.getTransactions);
// GET /api/v1/commissions/summary - Aggregate commissions report (Managers & Accountants)
commissionsRouter.get('/summary', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'), commissionsController.getSummary);
// GET /api/v1/commissions/staff/:userId - View staff member commissions history (All staff for self, managers for all)
commissionsRouter.get('/staff/:userId', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(userIdParamSchema), validateQuery(commissionTransactionQuerySchema), commissionsController.getStaffTransactions);
//# sourceMappingURL=commissions.routes.js.map