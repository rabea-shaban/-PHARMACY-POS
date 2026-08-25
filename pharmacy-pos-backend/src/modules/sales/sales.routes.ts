import { Router } from 'express';
import { salesController } from './sales.controller.js';
import {
  checkoutRequestSchema,
  saleQuerySchema,
  saleIdParamSchema,
  cancelSaleSchema,
} from './sales.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const salesRouter = Router();

// Staff authentication required for all sales endpoints
salesRouter.use(authenticate);

// GET /api/v1/sales - Search & list sales (All staff)
salesRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(saleQuerySchema),
  salesController.getSales
);

// GET /api/v1/sales/invoice/:invoiceNumber - Lookup sale by invoice number (All staff)
salesRouter.get(
  '/invoice/:invoiceNumber',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  salesController.getSaleByInvoice
);

// GET /api/v1/sales/:id - Get sale invoice details (All staff)
salesRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(saleIdParamSchema),
  salesController.getSaleById
);

// POST /api/v1/sales - Checkout / Create completed sale (Managers & Pharmacists)
salesRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(checkoutRequestSchema),
  salesController.checkout
);

// POST /api/v1/sales/:id/cancel - Cancel a completed sale (Managers only)
salesRouter.post(
  '/:id/cancel',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(saleIdParamSchema),
  validateBody(cancelSaleSchema),
  salesController.cancelSale
);
