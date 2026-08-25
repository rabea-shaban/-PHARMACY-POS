import { Router } from 'express';
import { productsController } from './products.controller.js';
import { batchesController } from '../batches/batches.controller.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productSearchQuerySchema,
  productIdParamSchema,
  barcodeParamSchema,
  expiringQuerySchema,
} from './products.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const productsRouter = Router();

// Staff authentication required for all product endpoints
productsRouter.use(authenticate);

// GET /api/v1/products - Search & list products (All staff)
productsRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(productQuerySchema),
  productsController.getProducts
);

// GET /api/v1/products/search - POS-optimized product search (All staff)
productsRouter.get(
  '/search',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(productSearchQuerySchema),
  productsController.searchProducts
);

// GET /api/v1/products/low-stock - List low stock products (All staff)
productsRouter.get(
  '/low-stock',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  productsController.getLowStockProducts
);

// GET /api/v1/products/expiring - List expiring products (All staff)
productsRouter.get(
  '/expiring',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateQuery(expiringQuerySchema),
  productsController.getExpiringProducts
);

// GET /api/v1/products/barcode/:barcode - Fast barcode lookup (All staff)
productsRouter.get(
  '/barcode/:barcode',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(barcodeParamSchema),
  productsController.getProductByBarcode
);

// GET /api/v1/products/:id/stock - Product stock summary breakdown (All staff)
productsRouter.get(
  '/:id/stock',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(productIdParamSchema),
  productsController.getProductStock
);

// GET /api/v1/products/:productId/batches - Get all batches of a product (All staff)
productsRouter.get(
  '/:productId/batches',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  batchesController.getBatchesByProductId
);

// GET /api/v1/products/:id - Get product details (All staff)
productsRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'),
  validateParams(productIdParamSchema),
  productsController.getProductById
);

// POST /api/v1/products - Create product (Managers & Pharmacists)
productsRouter.post(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateBody(createProductSchema),
  productsController.createProduct
);

// PATCH /api/v1/products/:id - Update product (Managers & Pharmacists)
productsRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'),
  validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  productsController.updateProduct
);

// DELETE /api/v1/products/:id - Soft-deactivate product (Managers only)
productsRouter.delete(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(productIdParamSchema),
  productsController.deleteProduct
);

// Missing ID fallbacks
productsRouter.patch('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Product ID is required in URL path (e.g. PATCH /api/v1/products/<productId>)',
  });
});

productsRouter.delete('/', (_req, res) => {
  res.status(400).json({
    success: false,
    message: 'Product ID is required in URL path (e.g. DELETE /api/v1/products/<productId>)',
  });
});
