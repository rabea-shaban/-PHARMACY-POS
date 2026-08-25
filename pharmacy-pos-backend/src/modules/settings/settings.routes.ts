import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import {
  settingKeyParamSchema,
  updateSettingsSchema,
  updateSingleSettingSchema,
} from './settings.validator.js';
import { validateBody, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const settingsRouter = Router();

// 1. GET /api/v1/settings/public - Public configuration for UI / Receipts (no auth required)
settingsRouter.get(
  '/public',
  settingsController.getPublicSettings
);

// Authenticate for all management routes
settingsRouter.use(authenticate);

// 2. GET /api/v1/settings - Get all settings (Managers & Accountants)
settingsRouter.get(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  settingsController.getAllSettings
);

// 3. PATCH /api/v1/settings - Batch update system settings (Managers only)
settingsRouter.patch(
  '/',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateBody(updateSettingsSchema),
  settingsController.updateSettings
);

// 4. GET /api/v1/settings/:key - Get single setting value
settingsRouter.get(
  '/:key',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'),
  validateParams(settingKeyParamSchema),
  settingsController.getSettingByKey
);

// 5. PATCH /api/v1/settings/:key - Update single setting value (Managers only)
settingsRouter.patch(
  '/:key',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(settingKeyParamSchema),
  validateBody(updateSingleSettingSchema),
  settingsController.updateSingleSetting
);
