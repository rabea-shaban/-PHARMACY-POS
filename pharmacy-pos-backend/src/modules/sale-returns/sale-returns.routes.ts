import { Router } from 'express';
import { saleReturnsController } from './sale-returns.controller.js';
import {
  createSaleReturnSchema,
  saleReturnQuerySchema,
  returnIdParamSchema,
  saleIdParamSchema,
} from './sale-returns.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const saleReturnsRouter = Router();

// Staff authentication required for all return endpoints
saleReturnsRouter.use(authenticate);

// GET /api/v1/sale-returns - Search & list returns (All staff)
saleReturnsRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(saleReturnQuerySchema),
  saleReturnsController.getSaleReturns
);

// GET /api/v1/sale-returns/:id - Get single return details (All staff)
saleReturnsRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(returnIdParamSchema),
  saleReturnsController.getSaleReturnById
);

// GET /api/v1/sale-returns/sales/:saleId - Get returns for a specific sale (All staff)
saleReturnsRouter.get(
  '/sales/:saleId',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(saleIdParamSchema),
  saleReturnsController.getReturnsBySaleId
);

// POST /api/v1/sale-returns - Process sale return (Managers & Pharmacists)
saleReturnsRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createSaleReturnSchema),
  saleReturnsController.createSaleReturn
);
