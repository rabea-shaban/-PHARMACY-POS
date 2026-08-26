import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface UserStatusBadgeProps {
  isActive: boolean;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>نشط وله صلاحية الدخول</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
      <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
      <span>معطل ومحظور الدخول</span>
    </span>
  );
};
