import { Router } from 'express';
import { suppliersController } from './suppliers.controller.js';
import {
  createSupplierSchema,
  updateSupplierSchema,
  supplierQuerySchema,
  supplierIdParamSchema,
} from './suppliers.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const suppliersRouter = Router();

// Staff authentication required for all supplier endpoints
suppliersRouter.use(authenticate);

// GET /api/v1/suppliers - Search & list suppliers (All staff)
suppliersRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(supplierQuerySchema),
  suppliersController.getSuppliers
);

// GET /api/v1/suppliers/:id - Get supplier details (All staff)
suppliersRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(supplierIdParamSchema),
  suppliersController.getSupplierById
);

// GET /api/v1/suppliers/:id/purchases - Get supplier purchases (All staff)
suppliersRouter.get(
  '/:id/purchases',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(supplierIdParamSchema),
  suppliersController.getSupplierPurchases
);

// POST /api/v1/suppliers - Create supplier (Managers & Pharmacists)
suppliersRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createSupplierSchema),
  suppliersController.createSupplier
);

// PATCH /api/v1/suppliers/:id - Update supplier (Managers & Pharmacists)
suppliersRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(supplierIdParamSchema),
  validateBody(updateSupplierSchema),
  suppliersController.updateSupplier
);

// DELETE /api/v1/suppliers/:id - Soft-deactivate supplier (Managers only)
suppliersRouter.delete(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(supplierIdParamSchema),
  suppliersController.deleteSupplier
);

// Missing ID fallbacks
suppliersRouter.patch('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Supplier ID is required in URL path (e.g. PATCH /api/v1/suppliers/<supplierId>)',
  });
});

suppliersRouter.delete('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Supplier ID is required in URL path (e.g. DELETE /api/v1/suppliers/<supplierId>)',
  });
});
