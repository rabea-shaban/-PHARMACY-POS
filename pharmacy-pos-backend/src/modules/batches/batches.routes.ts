import { Router } from 'express';
import { batchesController } from './batches.controller.js';
import {
  createBatchSchema,
  updateBatchSchema,
  batchQuerySchema,
  batchIdParamSchema,
  expiringQuerySchema,
} from './batches.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const batchesRouter = Router();

// Staff authentication required for all batch endpoints
batchesRouter.use(authenticate);

// GET /api/v1/batches - Search & list batches (All staff)
batchesRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(batchQuerySchema),
  batchesController.getBatches
);

// GET /api/v1/batches/expiring - Batches expiring soon (All staff)
batchesRouter.get(
  '/expiring',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(expiringQuerySchema),
  batchesController.getExpiringBatches
);

// GET /api/v1/batches/expiring-soon - Alias for expiring soon (All staff)
batchesRouter.get(
  '/expiring-soon',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(expiringQuerySchema),
  batchesController.getExpiringBatches
);

// GET /api/v1/batches/expired - Expired batches (All staff)
batchesRouter.get(
  '/expired',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  batchesController.getExpiredBatches
);

// GET /api/v1/batches/:id - Get batch details (All staff)
batchesRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(batchIdParamSchema),
  batchesController.getBatchById
);

// POST /api/v1/batches - Create batch (Managers & Pharmacists)
batchesRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createBatchSchema),
  batchesController.createBatch
);

// PATCH /api/v1/batches/:id - Update batch details (Managers & Pharmacists)
batchesRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(batchIdParamSchema),
  validateBody(updateBatchSchema),
  batchesController.updateBatch
);

// Missing ID fallbacks
batchesRouter.patch('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Batch ID is required in URL path (e.g. PATCH /api/v1/batches/<batchId>)',
  });
});
