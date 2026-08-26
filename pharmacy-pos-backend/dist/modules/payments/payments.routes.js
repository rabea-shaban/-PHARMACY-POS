import { Router } from 'express';
import { paymentsController } from './payments.controller.js';
import { paymentQuerySchema, paymentIdParamSchema, saleIdParamSchema, } from './payments.validator.js';
import { validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const paymentsRouter = Router();
// Staff authentication required for all payment endpoints
paymentsRouter.use(authenticate);
// GET /api/v1/payments - List historical payments (All staff)
paymentsRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateQuery(paymentQuerySchema), paymentsController.getPayments);
// GET /api/v1/payments/:id - Get payment by ID (All staff)
paymentsRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(paymentIdParamSchema), paymentsController.getPaymentById);
// GET /api/v1/payments/sales/:saleId - Get all payments for a specific sale (All staff)
paymentsRouter.get('/sales/:saleId', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(saleIdParamSchema), paymentsController.getPaymentsBySaleId);
//# sourceMappingURL=payments.routes.js.map