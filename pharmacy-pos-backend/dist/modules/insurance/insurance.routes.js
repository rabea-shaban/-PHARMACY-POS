import { Router } from 'express';
import { insuranceController } from './insurance.controller.js';
import { createInsuranceProviderSchema, updateInsuranceProviderSchema, createCustomerInsuranceSchema, insuranceQuerySchema, insuranceProviderIdParamSchema, customerIdParamSchema, } from './insurance.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const insuranceRouter = Router();
// Staff authentication required for all insurance endpoints
insuranceRouter.use(authenticate);
// GET /api/v1/insurance/providers - List insurance providers (All staff)
insuranceRouter.get('/providers', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateQuery(insuranceQuerySchema), insuranceController.getProviders);
// GET /api/v1/insurance/providers/:id - Get insurance provider by ID (All staff)
insuranceRouter.get('/providers/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(insuranceProviderIdParamSchema), insuranceController.getProviderById);
// POST /api/v1/insurance/providers - Create insurance provider (Managers only)
insuranceRouter.post('/providers', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateBody(createInsuranceProviderSchema), insuranceController.createProvider);
// PATCH /api/v1/insurance/providers/:id - Update insurance provider (Managers only)
insuranceRouter.patch('/providers/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(insuranceProviderIdParamSchema), validateBody(updateInsuranceProviderSchema), insuranceController.updateProvider);
// GET /api/v1/insurance/customers/:customerId - Get customer policies (All staff)
insuranceRouter.get('/customers/:customerId', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(customerIdParamSchema), insuranceController.getCustomerInsurances);
// POST /api/v1/insurance/customers - Register customer policy (Managers & Pharmacists)
insuranceRouter.post('/customers', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateBody(createCustomerInsuranceSchema), insuranceController.createCustomerInsurance);
//# sourceMappingURL=insurance.routes.js.map