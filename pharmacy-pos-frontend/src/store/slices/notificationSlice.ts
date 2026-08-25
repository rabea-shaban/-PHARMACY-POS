import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationSliceState {
  unreadCount: number;
  recentNotifications: NotificationItem[];
}

const initialState: NotificationSliceState = {
  unreadCount: 0,
  recentNotifications: [],
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setRecentNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.recentNotifications = action.payload;
    },
    markLocalRead: (state, action: PayloadAction<string>) => {
      const target = state.recentNotifications.find((n) => n.id === action.payload);
      if (target && !target.isRead) {
        target.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
});

export const { setUnreadCount, setRecentNotifications, markLocalRead } = notificationSlice.actions;
export default notificationSlice.reducer;
