import { notificationsService } from './notifications.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class NotificationsController {
    service;
    constructor(service = notificationsService) {
        this.service = service;
    }
    getUserNotifications = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const filters = req.query;
            const result = await this.service.getUserNotifications(userId, filters);
            sendSuccess(res, 'Notifications retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getUnreadCount = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const result = await this.service.getUnreadCount(userId);
            sendSuccess(res, 'Unread notification count retrieved', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    markAsRead = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const id = req.params.id;
            const result = await this.service.markAsRead(id, userId);
            sendSuccess(res, 'Notification marked as read', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    markAllAsRead = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const result = await this.service.markAllAsRead(userId);
            sendSuccess(res, 'All notifications marked as read', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const notificationsController = new NotificationsController();
//# sourceMappingURL=notifications.controller.js.map