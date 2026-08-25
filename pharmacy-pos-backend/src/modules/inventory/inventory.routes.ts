import { Router } from 'express';
import { inventoryController } from './inventory.controller.js';
import {
  stockAdjustmentSchema,
  inventoryTransactionQuerySchema,
  productIdParamSchema,
  batchIdParamSchema,
} from './inventory.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const inventoryRouter = Router();

// Staff authentication required for all inventory endpoints
inventoryRouter.use(authenticate);

// GET /api/v1/inventory/transactions - List historical inventory transactions (All staff)
inventoryRouter.get(
  '/transactions',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(inventoryTransactionQuerySchema),
  inventoryController.getTransactions
);

// GET /api/v1/inventory/low-stock - List low stock report (All staff)
inventoryRouter.get(
  '/low-stock',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  inventoryController.getLowStockReport
);

// GET /api/v1/inventory/expiring - List expiring stock report (All staff)
inventoryRouter.get(
  '/expiring',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  inventoryController.getExpiringReport
);

// GET /api/v1/inventory/products/:productId - Stock transactions for a specific product (All staff)
inventoryRouter.get(
  '/products/:productId',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(productIdParamSchema),
  inventoryController.getProductTransactions
);

// GET /api/v1/inventory/batches/:batchId - Stock transactions for a specific batch (All staff)
inventoryRouter.get(
  '/batches/:batchId',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(batchIdParamSchema),
  inventoryController.getBatchTransactions
);

// POST /api/v1/inventory/adjustments - Manual stock adjustment (Managers only)
inventoryRouter.post(
  '/adjustments',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateBody(stockAdjustmentSchema),
  inventoryController.adjustStock
);

// POST /api/v1/inventory/adjust - Alias for manual stock adjustment (Managers only)
inventoryRouter.post(
  '/adjust',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateBody(stockAdjustmentSchema),
  inventoryController.adjustStock
);
