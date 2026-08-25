import { Request, Response, NextFunction } from 'express';
import { notificationsService, NotificationsService } from './notifications.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { NotificationQueryDTO } from './notifications.validator.js';

export class NotificationsController {
  constructor(private readonly service: NotificationsService = notificationsService) {}

  getUserNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const filters = req.query as unknown as NotificationQueryDTO;
      const result = await this.service.getUserNotifications(userId, filters);
      sendSuccess(res, 'Notifications retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.getUnreadCount(userId);
      sendSuccess(res, 'Unread notification count retrieved', result, 200);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const id = req.params.id as string;
      const result = await this.service.markAsRead(id, userId);
      sendSuccess(res, 'Notification marked as read', result, 200);
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.markAllAsRead(userId);
      sendSuccess(res, 'All notifications marked as read', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const notificationsController = new NotificationsController();
