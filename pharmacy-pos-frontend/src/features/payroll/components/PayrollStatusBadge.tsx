import React from 'react';
import { PayrollStatus } from '../types/payroll.types.js';
import { FileEdit, Clock, CheckCircle2, XCircle } from 'lucide-react';

export interface PayrollStatusBadgeProps {
  status: PayrollStatus;
}

export const PayrollStatusBadge: React.FC<PayrollStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <FileEdit className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>مسودة (DRAFT)</span>
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>معتمد بانتظار الصرف (PENDING)</span>
        </span>
      );
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>تم الصرف والتحويل (PAID)</span>
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>ملغي ومحذوف (CANCELLED)</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <span>{status}</span>
        </span>
      );
  }
};
