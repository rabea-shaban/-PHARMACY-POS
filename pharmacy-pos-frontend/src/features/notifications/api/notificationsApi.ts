import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  NotificationItem,
  NotificationQueryParams,
  UnreadCountResponse,
} from '../types/notification.types.js';

export const notificationsApi = {
  // 1. Get live unread notification count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
    return response.data.data.unreadCount;
  },

  // 2. Get user notifications with filtering & pagination
  getNotifications: async (
    params?: NotificationQueryParams
  ): Promise<PaginatedResponse<NotificationItem>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<NotificationItem>>>(
      '/notifications',
      { params }
    );
    return response.data.data;
  },

  // 3. Mark single notification as read
  markAsRead: async (id: string): Promise<void> => {
    await api.patch<ApiResponse<null>>(`/notifications/${id}/read`);
  },

  // 4. Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch<ApiResponse<null>>('/notifications/read-all');
  },
};
