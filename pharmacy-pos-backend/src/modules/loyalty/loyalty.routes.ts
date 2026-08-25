import { Router } from 'express';
import { loyaltyController } from './loyalty.controller.js';
import {
  earnPointsSchema,
  redeemPointsSchema,
  adjustPointsSchema,
  loyaltyTransactionQuerySchema,
} from './loyalty.validator.js';
import { customerIdParamSchema } from '../customers/customers.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

// 1. General Loyalty Router (mounted at /api/v1/loyalty)
export const loyaltyRouter = Router();

loyaltyRouter.use(authenticate);

// GET /api/v1/loyalty/tiers - List all customer tiers (All staff)
loyaltyRouter.get(
  '/tiers',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  loyaltyController.getCustomerTiers
);

// 2. Customer-Specific Loyalty Router (mounted at /api/v1/customers/:id/loyalty)
export const customerLoyaltyRouter = Router({ mergeParams: true });

customerLoyaltyRouter.use(authenticate);

// GET /api/v1/customers/:id/loyalty - Get customer loyalty balance & summary (All staff)
customerLoyaltyRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(customerIdParamSchema),
  loyaltyController.getLoyaltySummary
);

// GET /api/v1/customers/:id/loyalty/transactions - Paginated transactions (All staff)
customerLoyaltyRouter.get(
  '/transactions',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(customerIdParamSchema),
  validateQuery(loyaltyTransactionQuerySchema),
  loyaltyController.getLoyaltyTransactions
);

// POST /api/v1/customers/:id/loyalty/earn - Earn loyalty points (Pharmacists & Managers)
customerLoyaltyRouter.post(
  '/earn',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(customerIdParamSchema),
  validateBody(earnPointsSchema),
  loyaltyController.earnPoints
);

// POST /api/v1/customers/:id/loyalty/redeem - Redeem points for discounts (Pharmacists & Managers)
customerLoyaltyRouter.post(
  '/redeem',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(customerIdParamSchema),
  validateBody(redeemPointsSchema),
  loyaltyController.redeemPoints
);

// POST /api/v1/customers/:id/loyalty/adjust - Manual points adjustment (Managers only)
customerLoyaltyRouter.post(
  '/adjust',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(customerIdParamSchema),
  validateBody(adjustPointsSchema),
  loyaltyController.adjustPoints
);
