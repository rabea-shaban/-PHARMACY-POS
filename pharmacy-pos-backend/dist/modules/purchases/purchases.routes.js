import { Router } from 'express';
import { purchasesController } from './purchases.controller.js';
import { createPurchaseSchema, updatePurchaseSchema, receivePurchaseSchema, cancelPurchaseSchema, purchaseQuerySchema, purchaseIdParamSchema, } from './purchases.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const purchasesRouter = Router();
// Staff authentication required for all purchase endpoints
purchasesRouter.use(authenticate);
// GET /api/v1/purchases - Search & list purchases (All staff)
purchasesRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateQuery(purchaseQuerySchema), purchasesController.getPurchases);
// GET /api/v1/purchases/:id - Get purchase details (All staff)
purchasesRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(purchaseIdParamSchema), purchasesController.getPurchaseById);
// POST /api/v1/purchases - Create purchase invoice (Managers & Pharmacists)
purchasesRouter.post('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateBody(createPurchaseSchema), purchasesController.createPurchase);
// PATCH /api/v1/purchases/:id - Update draft purchase invoice (Managers & Pharmacists)
purchasesRouter.patch('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateParams(purchaseIdParamSchema), validateBody(updatePurchaseSchema), purchasesController.updatePurchase);
// POST /api/v1/purchases/:id/receive - Receive purchase into inventory (Managers & Pharmacists)
purchasesRouter.post('/:id/receive', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateParams(purchaseIdParamSchema), validateBody(receivePurchaseSchema), purchasesController.receivePurchase);
// POST /api/v1/purchases/:id/cancel - Cancel pending purchase (Managers only)
purchasesRouter.post('/:id/cancel', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(purchaseIdParamSchema), validateBody(cancelPurchaseSchema), purchasesController.cancelPurchase);
// Missing ID fallbacks
purchasesRouter.patch('/', (_req, res) => {
    res.status(400).json({
        success: false,
        message: 'Purchase ID is required in URL path (e.g. PATCH /api/v1/purchases/<purchaseId>)',
    });
});
//# sourceMappingURL=purchases.routes.js.map