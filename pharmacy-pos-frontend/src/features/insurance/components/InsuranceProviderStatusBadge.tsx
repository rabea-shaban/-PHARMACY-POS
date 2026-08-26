import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface InsuranceProviderStatusBadgeProps {
  isActive: boolean;
}

export const InsuranceProviderStatusBadge: React.FC<InsuranceProviderStatusBadgeProps> = ({
  isActive,
}) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>نشطة ومعتمدة</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
      <XCircle className="w-3.5 h-3.5" />
      <span>متوقفة / غير نشطة</span>
    </span>
  );
};
