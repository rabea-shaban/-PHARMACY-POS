import { Router } from 'express';
import { customersController } from './customers.controller.js';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
  customerIdParamSchema,
  customerPurchasesQuerySchema,
} from './customers.validator.js';
import { customerLoyaltyRouter } from '../loyalty/loyalty.routes.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const customersRouter = Router();

// Staff authentication required for all customer endpoints
customersRouter.use(authenticate);

// Mount Customer Loyalty Subdomain (e.g. GET /api/v1/customers/:id/loyalty, POST /api/v1/customers/:id/loyalty/earn, etc.)
customersRouter.use('/:id/loyalty', customerLoyaltyRouter);

// GET /api/v1/customers - Search & list customers (All staff)
customersRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(customerQuerySchema),
  customersController.getCustomers
);

// GET /api/v1/customers/:id - Get customer profile (All staff)
customersRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(customerIdParamSchema),
  customersController.getCustomerById
);

// GET /api/v1/customers/:id/purchases - Get customer purchase history (All staff)
customersRouter.get(
  '/:id/purchases',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(customerIdParamSchema),
  validateQuery(customerPurchasesQuerySchema),
  customersController.getCustomerPurchases
);

// POST /api/v1/customers - Register new customer (Managers & Pharmacists)
customersRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createCustomerSchema),
  customersController.createCustomer
);

// PATCH /api/v1/customers/:id - Update customer profile (Managers & Pharmacists)
customersRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(customerIdParamSchema),
  validateBody(updateCustomerSchema),
  customersController.updateCustomer
);

// DELETE /api/v1/customers/:id - Soft-deactivate customer (Managers only)
customersRouter.delete(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(customerIdParamSchema),
  customersController.deleteCustomer
);

// Missing ID fallbacks
customersRouter.patch('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Customer ID is required in URL path (e.g. PATCH /api/v1/customers/<customerId>)',
  });
});

customersRouter.delete('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Customer ID is required in URL path (e.g. DELETE /api/v1/customers/<customerId>)',
  });
});
