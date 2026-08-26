import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../hooks/useNotifications.js';
import { NotificationTypeBadge } from './NotificationTypeBadge.js';
import { formatDate } from '../../../lib/utils.js';
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotifications({
    page: 1,
    limit: 5,
  });

  const markReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.items || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute end-0 top-full mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-black text-slate-900 dark:text-white">
            {t('nav.notifications')}
          </h3>
        </div>

        {hasUnread && (
          <button
            type="button"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>تعيين الكل كمقروء</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1E293B]">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-bold">لا توجد إشعارات جديدة</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) markReadMutation.mutate(n.id);
              }}
              className={`p-3.5 text-xs transition-colors cursor-pointer ${
                n.isRead
                  ? 'hover:bg-slate-50 dark:hover:bg-[#1A2639]/50 opacity-75'
                  : 'bg-sky-50/40 dark:bg-sky-950/20 hover:bg-sky-50/80 dark:hover:bg-sky-950/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <NotificationTypeBadge type={n.type} />
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDate(n.createdAt)}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-0.5">
                {n.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0B0F17]/40 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1.5"
        >
          <span>عرض جميع الإشعارات والتنبيهات</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
