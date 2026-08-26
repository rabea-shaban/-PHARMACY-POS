import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../hooks/useNotifications.js';
import { NotificationItem } from '../components/NotificationItem.js';
import { NotificationFilters } from '../components/NotificationFilters.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);

  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useNotifications({
    page,
    limit: 15,
    type: (type as any) || undefined,
    isRead: status ? status === 'true' : undefined,
  });

  const markReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.items || [];
  const pagination = data?.pagination;
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleResetFilters = () => {
    setType('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>مركز التنبيهات والإشعارات (Notifications Center)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة تنبيهات النواقص، انتهاء الصلاحيات، عمليات البيع، وحركات النظام اللحظية
          </p>
        </div>

        {hasUnread && (
          <Button
            variant="outline"
            size="md"
            onClick={() => markAllMutation.mutate()}
            isLoading={markAllMutation.isPending}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            تعيين جميع الإشعارات كمقروءة
          </Button>
        )}
      </div>

      {/* Filters */}
      <NotificationFilters
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Notifications Stream */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-full bg-slate-100 dark:bg-[#131B2A] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Inbox}
            title="لا توجد إشعارات مسجلة"
            description="لم يتم العثور على أي تنبيهات تطابق خيارات الفلترة الحالية."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={(id) => markReadMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
          <p className="text-xs text-slate-500">
            {t('common.showing')} {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-[#1C273B] transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <span className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-[#1C273B] transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
