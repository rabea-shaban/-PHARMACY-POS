import { Router } from 'express';
import { transfersController } from './transfers.controller.js';
import {
  createTransferSchema,
  rejectTransferSchema,
  transferQuerySchema,
  transferIdParamSchema,
} from './transfers.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const transfersRouter = Router();

transfersRouter.use(authenticate);

// GET /api/v1/transfers - List transfers (All staff)
transfersRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(transferQuerySchema),
  transfersController.getTransfers
);

// GET /api/v1/transfers/:id - Get transfer details (All staff)
transfersRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(transferIdParamSchema),
  transfersController.getTransferById
);

// POST /api/v1/transfers - Initiate new transfer request (Managers & Pharmacists)
transfersRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createTransferSchema),
  transfersController.createTransfer
);

// POST /api/v1/transfers/:id/approve - Approve transfer request (Managers only)
transfersRouter.post(
  '/:id/approve',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(transferIdParamSchema),
  transfersController.approveTransfer
);

// POST /api/v1/transfers/:id/dispatch - Dispatch items from source branch (Managers & Pharmacists)
transfersRouter.post(
  '/:id/dispatch',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(transferIdParamSchema),
  transfersController.dispatchTransfer
);

// POST /api/v1/transfers/:id/receive - Receive items at destination branch (Managers & Pharmacists)
transfersRouter.post(
  '/:id/receive',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(transferIdParamSchema),
  transfersController.receiveTransfer
);

// POST /api/v1/transfers/:id/reject - Reject transfer request (Managers only)
transfersRouter.post(
  '/:id/reject',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(transferIdParamSchema),
  validateBody(rejectTransferSchema),
  transfersController.rejectTransfer
);

// POST /api/v1/transfers/:id/cancel - Cancel pending/approved transfer request
transfersRouter.post(
  '/:id/cancel',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(transferIdParamSchema),
  transfersController.cancelTransfer
);
