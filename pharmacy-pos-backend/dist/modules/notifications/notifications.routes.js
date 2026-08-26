import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { notificationQuerySchema, notificationIdParamSchema, } from './notifications.validator.js';
import { validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
export const notificationsRouter = Router();
// Staff authentication required for all notification endpoints
notificationsRouter.use(authenticate);
// 1. GET /api/v1/notifications/unread-count - Unread count for current user
notificationsRouter.get('/unread-count', notificationsController.getUnreadCount);
// 2. PATCH /api/v1/notifications/read-all - Mark all notifications as read for current user
notificationsRouter.patch('/read-all', notificationsController.markAllAsRead);
// 3. GET /api/v1/notifications - List notifications for current user with filters
notificationsRouter.get('/', validateQuery(notificationQuerySchema), notificationsController.getUserNotifications);
// 4. PATCH /api/v1/notifications/:id/read - Mark single notification as read
notificationsRouter.patch('/:id/read', validateParams(notificationIdParamSchema), notificationsController.markAsRead);
//# sourceMappingURL=notifications.routes.js.map