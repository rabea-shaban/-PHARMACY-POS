import { Router } from 'express';
import { whatsAppController } from './whatsapp.controller.js';
import {
  whatsappQuerySchema,
  whatsappMessageIdParamSchema,
} from './whatsapp.validator.js';
import { validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

export const whatsAppRouter = Router();

// Staff authentication required for all WhatsApp endpoints
whatsAppRouter.use(authenticate);

// 1. GET /api/v1/whatsapp/messages - Query WhatsApp message history
whatsAppRouter.get(
  '/messages',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateQuery(whatsappQuerySchema),
  whatsAppController.getMessages
);

// 2. GET /api/v1/whatsapp/messages/:id - Get WhatsApp message details
whatsAppRouter.get(
  '/messages/:id',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'),
  validateParams(whatsappMessageIdParamSchema),
  whatsAppController.getMessageById
);

// 3. POST /api/v1/whatsapp/messages/:id/retry - Retry failed WhatsApp message (Managers only)
whatsAppRouter.post(
  '/messages/:id/retry',
  authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'),
  validateParams(whatsappMessageIdParamSchema),
  whatsAppController.retryMessage
);
