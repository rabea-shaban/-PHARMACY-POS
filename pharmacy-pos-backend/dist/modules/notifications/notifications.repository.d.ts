import { Prisma, NotificationType, Role } from '@prisma/client';
import { NotificationQueryFilters } from './notifications.types.js';
export declare class NotificationsRepository {
    findMany(filters: NotificationQueryFilters): Promise<{
        items: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.NotificationType;
            title: string;
            message: string;
            isRead: boolean;
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        isRead: boolean;
    } | null>;
    countUnread(userId: string): Promise<number>;
    create(data: {
        userId: string;
        title: string;
        message: string;
        type?: NotificationType;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        isRead: boolean;
    }>;
    createMany(notifications: {
        userId: string;
        title: string;
        message: string;
        type: NotificationType;
    }[]): Promise<Prisma.BatchPayload>;
    markAsRead(id: string, userId: string): Promise<Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<Prisma.BatchPayload>;
    findUserIdsByRoles(roles: Role[]): Promise<string[]>;
}
export declare const notificationsRepository: NotificationsRepository;
