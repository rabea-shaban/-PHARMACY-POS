import { Router } from 'express';
import { discountsController } from './discounts.controller.js';
import { createDiscountSchema, updateDiscountSchema, discountQuerySchema, discountIdParamSchema, } from './discounts.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const discountsRouter = Router();
// Staff authentication required for all discount endpoints
discountsRouter.use(authenticate);
// GET /api/v1/discounts - Search & list discounts (All staff)
discountsRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateQuery(discountQuerySchema), discountsController.getDiscounts);
// GET /api/v1/discounts/:id - Get discount details (All staff)
discountsRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(discountIdParamSchema), discountsController.getDiscountById);
// POST /api/v1/discounts - Create discount (Managers only)
discountsRouter.post('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateBody(createDiscountSchema), discountsController.createDiscount);
// PATCH /api/v1/discounts/:id - Update discount (Managers only)
discountsRouter.patch('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(discountIdParamSchema), validateBody(updateDiscountSchema), discountsController.updateDiscount);
// DELETE /api/v1/discounts/:id - Soft-deactivate discount (Managers only)
discountsRouter.delete('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(discountIdParamSchema), discountsController.deleteDiscount);
//# sourceMappingURL=discounts.routes.js.map