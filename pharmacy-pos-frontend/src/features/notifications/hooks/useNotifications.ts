import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi.js';
import { NotificationQueryParams } from '../types/notification.types.js';
import { useAppDispatch } from '../../../store/hooks.js';
import { setUnreadCount } from '../../../store/slices/notificationSlice.js';
import { useEffect } from 'react';

export function useUnreadCount() {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    staleTime: 10 * 1000,
  });

  useEffect(() => {
    if (typeof query.data === 'number') {
      dispatch(setUnreadCount(query.data));
    }
  }, [query.data, dispatch]);

  return query;
}

export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 15 * 1000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
