import React from 'react';
import { NotificationItem as NotificationItemType } from '../types/notification.types.js';
import { NotificationTypeBadge } from './NotificationTypeBadge.js';
import { formatDate } from '../../../lib/utils.js';
import { Check, Clock } from 'lucide-react';

export interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        notification.isRead
          ? 'bg-white dark:bg-[#131B2A] border-slate-200/80 dark:border-[#223049] opacity-80'
          : 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <NotificationTypeBadge type={notification.type} />
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-900/50 shrink-0" />
            )}
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {notification.title}
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono pt-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(notification.createdAt)}</span>
          </div>
        </div>

        {!notification.isRead && onMarkAsRead && (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-white dark:hover:bg-[#1C273B] text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors cursor-pointer shrink-0"
            title="تعيين كمقروء"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
