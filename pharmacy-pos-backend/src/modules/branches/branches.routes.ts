import { Router } from 'express';
import { branchesController } from './branches.controller.js';
import {
  createBranchSchema,
  updateBranchSchema,
  branchQuerySchema,
  branchIdParamSchema,
} from './branches.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const branchesRouter = Router();

branchesRouter.use(authenticate);

// GET /api/v1/branches - List branches (All staff)
branchesRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(branchQuerySchema),
  branchesController.getBranches
);

// GET /api/v1/branches/:id - Get branch details (All staff)
branchesRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(branchIdParamSchema),
  branchesController.getBranchById
);

// POST /api/v1/branches - Create branch (Platform & Pharmacy Managers)
branchesRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateBody(createBranchSchema),
  branchesController.createBranch
);

// PATCH /api/v1/branches/:id - Update branch (Platform & Pharmacy Managers)
branchesRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(branchIdParamSchema),
  validateBody(updateBranchSchema),
  branchesController.updateBranch
);

// DELETE /api/v1/branches/:id - Deactivate branch (Platform & Pharmacy Managers)
branchesRouter.delete(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(branchIdParamSchema),
  branchesController.deleteBranch
);
