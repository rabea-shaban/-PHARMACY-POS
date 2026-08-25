import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { dashboardOverviewQuerySchema } from './dashboard.validator.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const dashboardRouter = Router();

// Staff authentication required for dashboard
dashboardRouter.use(authenticate);

// GET /api/v1/dashboard/overview - Top-level pharmacy operational and financial overview
dashboardRouter.get(
  '/overview',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateQuery(dashboardOverviewQuerySchema),
  dashboardController.getOverview
);
