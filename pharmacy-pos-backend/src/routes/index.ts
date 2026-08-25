import { Router } from 'express';
import { healthRoutes } from '../modules/health/index.js';
import { authRouter } from '../modules/auth/index.js';
import { usersRouter } from '../modules/users/index.js';
import { customersRouter } from '../modules/customers/index.js';
import { loyaltyRouter } from '../modules/loyalty/index.js';
import { categoriesRouter } from '../modules/categories/index.js';
import { productsRouter } from '../modules/products/index.js';
import { batchesRouter } from '../modules/batches/index.js';
import { inventoryRouter } from '../modules/inventory/index.js';
import { suppliersRouter } from '../modules/suppliers/index.js';
import { purchasesRouter } from '../modules/purchases/index.js';
import { salesRouter } from '../modules/sales/index.js';
import { paymentsRouter } from '../modules/payments/index.js';
import { discountsRouter } from '../modules/discounts/index.js';
import { insuranceRouter } from '../modules/insurance/index.js';
import { saleReturnsRouter } from '../modules/sale-returns/index.js';
import { expensesRouter } from '../modules/expenses/index.js';
import { commissionsRouter } from '../modules/commissions/index.js';
import { dashboardRouter } from '../modules/dashboard/index.js';
import { reportsRouter } from '../modules/reports/index.js';
import { payrollRouter } from '../modules/payroll/index.js';
import { notificationsRouter } from '../modules/notifications/index.js';
import { whatsAppRouter } from '../modules/whatsapp/index.js';
import { auditRouter } from '../modules/audit/index.js';
import { settingsRouter } from '../modules/settings/index.js';
import { securityRouter } from '../modules/security/index.js';

export const apiRouter = Router();

// Health Check Module
apiRouter.use('/health', healthRoutes);

// Authentication Module
apiRouter.use('/auth', authRouter);

// Staff Users Management Module
apiRouter.use('/users', usersRouter);

// Customers Module
apiRouter.use('/customers', customersRouter);

// Loyalty Module
apiRouter.use('/loyalty', loyaltyRouter);

// Categories Module
apiRouter.use('/categories', categoriesRouter);

// Products Module
apiRouter.use('/products', productsRouter);

// Batches Module
apiRouter.use('/batches', batchesRouter);

// Inventory Module
apiRouter.use('/inventory', inventoryRouter);

// Suppliers Module
apiRouter.use('/suppliers', suppliersRouter);

// Purchases Module
apiRouter.use('/purchases', purchasesRouter);

// Sales & POS Checkout Module
apiRouter.use('/sales', salesRouter);

// Payments Module
apiRouter.use('/payments', paymentsRouter);

// Discounts Module
apiRouter.use('/discounts', discountsRouter);

// Insurance Module
apiRouter.use('/insurance', insuranceRouter);

// Sale Returns Module
apiRouter.use('/sale-returns', saleReturnsRouter);

// Operating Expenses Module
apiRouter.use('/expenses', expensesRouter);

// Staff Commissions Module
apiRouter.use('/commissions', commissionsRouter);

// Dashboard Overview Module
apiRouter.use('/dashboard', dashboardRouter);

// Reports & Business Intelligence Module
apiRouter.use('/reports', reportsRouter);

// Workforce Payroll Management Module
apiRouter.use('/payroll', payrollRouter);

// System Notifications Module
apiRouter.use('/notifications', notificationsRouter);

// WhatsApp Customer Communication Module
apiRouter.use('/whatsapp', whatsAppRouter);

// Audit Logs & Activity Tracking Module
apiRouter.use('/audit-logs', auditRouter);

// System & Business Configuration Settings Module
apiRouter.use('/settings', settingsRouter);

// Security & Authentication Activity Logs Module
apiRouter.use('/security', securityRouter);
