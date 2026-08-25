import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import {
  salesReportQuerySchema,
  productReportQuerySchema,
  inventoryReportQuerySchema,
  purchaseReportQuerySchema,
  expenseReportQuerySchema,
  customerReportQuerySchema,
  staffReportQuerySchema,
  financialSummaryQuerySchema,
} from './reports.validator.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const reportsRouter = Router();

// Staff authentication required for all report endpoints
reportsRouter.use(authenticate);

// 1. GET /api/v1/reports/sales - Comprehensive Sales Report (Managers, Accountants, Pharmacists)
reportsRouter.get(
  '/sales',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateQuery(salesReportQuerySchema),
  reportsController.getSalesReport
);

// 2. GET /api/v1/reports/products - Product Performance, Top Sellers & Slow Movers (Managers, Accountants, Pharmacists)
reportsRouter.get(
  '/products',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateQuery(productReportQuerySchema),
  reportsController.getProductReport
);

// 3. GET /api/v1/reports/inventory - Stock Health, Expiry Horizons & Stock Movements (Managers, Accountants, Pharmacists)
reportsRouter.get(
  '/inventory',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateQuery(inventoryReportQuerySchema),
  reportsController.getInventoryReport
);

// 4. GET /api/v1/reports/purchases - Procurement & Supplier Spend Report (Managers, Accountants)
reportsRouter.get(
  '/purchases',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateQuery(purchaseReportQuerySchema),
  reportsController.getPurchaseReport
);

// 5. GET /api/v1/reports/expenses - Operating Expenses & Category Distribution (Managers, Accountants)
reportsRouter.get(
  '/expenses',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateQuery(expenseReportQuerySchema),
  reportsController.getExpenseReport
);

// 6. GET /api/v1/reports/customers - Customer Purchasing Trends & Loyalty Distribution (Managers, Accountants, Pharmacists)
reportsRouter.get(
  '/customers',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateQuery(customerReportQuerySchema),
  reportsController.getCustomerReport
);

// 7. GET /api/v1/reports/staff - Staff Sales Performance & Commission Earnings (Managers, Accountants only)
reportsRouter.get(
  '/staff',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateQuery(staffReportQuerySchema),
  reportsController.getStaffReport
);

// 8. GET /api/v1/reports/financial-summary - High-level Executive Financial Summary (Managers, Accountants only)
reportsRouter.get(
  '/financial-summary',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateQuery(financialSummaryQuerySchema),
  reportsController.getFinancialSummary
);
