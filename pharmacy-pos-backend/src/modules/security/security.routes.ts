import { Router } from 'express';
import { securityController } from './security.controller.js';
import {
  securityQuerySchema,
  securityStatsQuerySchema,
} from './security.validator.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const securityRouter = Router();

// Staff authentication and Manager authorization required for all security endpoints
securityRouter.use(authenticate);
securityRouter.use(authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'));

// 1. GET /api/v1/security/stats - Authentication attempt stats and failure rates
securityRouter.get(
  '/stats',
  validateQuery(securityStatsQuerySchema),
  securityController.getStats
);

// 2. GET /api/v1/security/logs - Query login and security event history
securityRouter.get(
  '/logs',
  validateQuery(securityQuerySchema),
  securityController.getLoginLogs
);
