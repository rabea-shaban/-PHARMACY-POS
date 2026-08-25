import { NotificationType, Role } from '@prisma/client';
import { PaginationMeta } from '../../types/common.types.js';

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}

export interface NotifyRolesInput {
  roles: Role[];
  title: string;
  message: string;
  type?: NotificationType;
}

export interface NotificationQueryFilters {
  page?: number;
  limit?: number;
  userId: string;
  isRead?: boolean;
  type?: NotificationType;
}

export interface PaginatedNotificationsResponse {
  items: NotificationResponse[];
  pagination: PaginationMeta;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
