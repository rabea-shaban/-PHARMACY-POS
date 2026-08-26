import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service.js';
export declare class NotificationsController {
    private readonly service;
    constructor(service?: NotificationsService);
    getUserNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUnreadCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const notificationsController: NotificationsController;
