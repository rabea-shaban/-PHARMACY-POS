import { NotificationsRepository } from './notifications.repository.js';
import { NotificationResponse, CreateNotificationInput, NotifyRolesInput, PaginatedNotificationsResponse, UnreadCountResponse } from './notifications.types.js';
import { NotificationQueryDTO } from './notifications.validator.js';
export declare class NotificationsService {
    private readonly repo;
    constructor(repo?: NotificationsRepository);
    getUserNotifications(userId: string, filters: NotificationQueryDTO): Promise<PaginatedNotificationsResponse>;
    getUnreadCount(userId: string): Promise<UnreadCountResponse>;
    markAsRead(id: string, userId: string): Promise<NotificationResponse>;
    markAllAsRead(userId: string): Promise<{
        markedCount: number;
    }>;
    createNotification(input: CreateNotificationInput): Promise<NotificationResponse>;
    notifyRoles(input: NotifyRolesInput): Promise<{
        recipientCount: number;
    }>;
}
export declare const notificationsService: NotificationsService;
