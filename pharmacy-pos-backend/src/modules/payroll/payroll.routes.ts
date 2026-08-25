import { Router } from 'express';
import { payrollController } from './payroll.controller.js';
import {
  generatePayrollSchema,
  generatePeriodPayrollSchema,
  updatePayrollSchema,
  payPayrollSchema,
  payrollQuerySchema,
  payrollIdParamSchema,
  employeeIdParamSchema,
} from './payroll.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const payrollRouter = Router();

// Staff authentication required for all payroll endpoints
payrollRouter.use(authenticate);

// 1. GET /api/v1/payroll/summary - Aggregated payroll metrics & distribution
payrollRouter.get(
  '/summary',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  payrollController.getSummary
);

// 2. POST /api/v1/payroll/generate - Calculate & generate payroll for a single employee
payrollRouter.post(
  '/generate',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateBody(generatePayrollSchema),
  payrollController.generatePayroll
);

// 3. POST /api/v1/payroll/generate-period - Generate payroll for all active employees in a period
payrollRouter.post(
  '/generate-period',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateBody(generatePeriodPayrollSchema),
  payrollController.generatePeriodPayroll
);

// 4. GET /api/v1/payroll - List & filter payrolls (by date, employee, status)
payrollRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateQuery(payrollQuerySchema),
  payrollController.getPayrolls
);

// 5. GET /api/v1/payroll/employee/:employeeId - History of payrolls for an employee
payrollRouter.get(
  '/employee/:employeeId',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateParams(employeeIdParamSchema),
  payrollController.getEmployeePayrolls
);

// 6. GET /api/v1/payroll/:id - Get specific payroll record details with breakdown
payrollRouter.get(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateParams(payrollIdParamSchema),
  payrollController.getPayrollById
);

// 7. PATCH /api/v1/payroll/:id - Update draft/pending payroll components
payrollRouter.patch(
  '/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateParams(payrollIdParamSchema),
  validateBody(updatePayrollSchema),
  payrollController.updatePayroll
);

// 8. POST /api/v1/payroll/:id/approve - Approve payroll (DRAFT -> PENDING)
payrollRouter.post(
  '/:id/approve',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateParams(payrollIdParamSchema),
  payrollController.approvePayroll
);

// 9. POST /api/v1/payroll/:id/pay - Atomic payment settlement (PENDING -> PAID)
payrollRouter.post(
  '/:id/pay',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateParams(payrollIdParamSchema),
  validateBody(payPayrollSchema),
  payrollController.payPayroll
);

// 10. POST /api/v1/payroll/:id/cancel - Cancel payroll (Managers only)
payrollRouter.post(
  '/:id/cancel',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(payrollIdParamSchema),
  payrollController.cancelPayroll
);
