import { Router } from 'express';
import { categoriesController } from './categories.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  categoryIdParamSchema,
} from './categories.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const categoriesRouter = Router();

// Staff authentication required for all category endpoints
categoriesRouter.use(authenticate);

// GET /api/v1/categories - Search & list categories (All staff)
categoriesRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(categoryQuerySchema),
  categoriesController.getCategories
);

// GET /api/v1/categories/:id - Get category details (All staff)
categoriesRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(categoryIdParamSchema),
  categoriesController.getCategoryById
);

// POST /api/v1/categories - Create category (Managers & Pharmacists)
categoriesRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createCategorySchema),
  categoriesController.createCategory
);

// PATCH /api/v1/categories/:id - Update category (Managers & Pharmacists)
categoriesRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(categoryIdParamSchema),
  validateBody(updateCategorySchema),
  categoriesController.updateCategory
);

// DELETE /api/v1/categories/:id - Soft-deactivate category (Managers only)
categoriesRouter.delete(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(categoryIdParamSchema),
  categoriesController.deleteCategory
);

// Missing ID fallbacks
categoriesRouter.patch('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Category ID is required in URL path (e.g. PATCH /api/v1/categories/<categoryId>)',
  });
});

categoriesRouter.delete('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Category ID is required in URL path (e.g. DELETE /api/v1/categories/<categoryId>)',
  });
});
