import React from 'react';
import { NotificationType } from '../types/notification.types.js';
import { AlertTriangle, AlertCircle, ShoppingBag, Info, Bell } from 'lucide-react';

export interface NotificationTypeBadgeProps {
  type: NotificationType;
}

export const NotificationTypeBadge: React.FC<NotificationTypeBadgeProps> = ({ type }) => {
  switch (type) {
    case 'LOW_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>نواقص ومخزون حرج</span>
        </span>
      );
    case 'EXPIRY_ALERT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>تنبيه صلاحية قريبة</span>
        </span>
      );
    case 'SALE_COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <ShoppingBag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>عملية بيع مكتملة</span>
        </span>
      );
    case 'SYSTEM_ALERT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <Info className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>تنبيه نظام وأمان</span>
        </span>
      );
    case 'GENERAL':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          <Bell className="w-3 h-3 text-slate-500" />
          <span>إشعار عام</span>
        </span>
      );
  }
};
