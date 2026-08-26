export type NotificationType =
  | 'LOW_STOCK'
  | 'EXPIRY_ALERT'
  | 'SALE_COMPLETED'
  | 'SYSTEM_ALERT'
  | 'GENERAL';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
