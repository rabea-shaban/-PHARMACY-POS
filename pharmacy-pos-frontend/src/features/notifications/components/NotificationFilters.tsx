import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export interface NotificationFiltersProps {
  type: string;
  onTypeChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  onReset: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  type,
  onTypeChange,
  status,
  onStatusChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const hasFilters = Boolean(type || status);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
      <div className="flex-1 sm:w-64">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">جميع أنواع التنبيهات</option>
          <option value="LOW_STOCK">نواقص ومخزون حرج (Low Stock)</option>
          <option value="EXPIRY_ALERT">تنبيهات الصلاحية (Expiry Alert)</option>
          <option value="SALE_COMPLETED">مبيعات مكتملة (Sale Completed)</option>
          <option value="SYSTEM_ALERT">تنبيهات النظام والأمان (System Alert)</option>
          <option value="GENERAL">إشعارات عامة (General)</option>
        </select>
      </div>

      <div className="w-full sm:w-48">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">جميع الحالات</option>
          <option value="false">غير مقروءة فقط (Unread)</option>
          <option value="true">مقروءة (Read)</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t('common.clearFilters')}</span>
        </button>
      )}
    </div>
  );
};
