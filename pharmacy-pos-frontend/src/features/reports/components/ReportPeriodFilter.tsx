import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../components/ui/Input.js';
import { Calendar, X } from 'lucide-react';

export interface ReportPeriodFilterProps {
  from: string;
  onFromChange: (val: string) => void;
  to: string;
  onToChange: (val: string) => void;
  onQuickPeriodSelect?: (preset: 'today' | 'thisMonth' | 'lastMonth' | 'all') => void;
  onReset: () => void;
}

export const ReportPeriodFilter: React.FC<ReportPeriodFilterProps> = ({
  from,
  onFromChange,
  to,
  onToChange,
  onQuickPeriodSelect,
  onReset,
}) => {
  const { t } = useTranslation();
  const hasFilters = Boolean(from || to);

  const handlePreset = (preset: 'today' | 'thisMonth' | 'lastMonth' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      const today = now.toISOString().split('T')[0];
      onFromChange(today);
      onToChange(today);
    } else if (preset === 'thisMonth') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      onFromChange(first);
      onToChange(last);
    } else if (preset === 'lastMonth') {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const last = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      onFromChange(first);
      onToChange(last);
    } else if (preset === 'all') {
      onReset();
    }
    if (onQuickPeriodSelect) onQuickPeriodSelect(preset);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <button
          type="button"
          onClick={() => handlePreset('thisMonth')}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 hover:bg-sky-100 transition-colors shrink-0 cursor-pointer"
        >
          الشهر الحالي
        </button>
        <button
          type="button"
          onClick={() => handlePreset('lastMonth')}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          الشهر السابق
        </button>
        <button
          type="button"
          onClick={() => handlePreset('today')}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          اليوم فقط
        </button>
      </div>

      {/* Date Pickers */}
      <div className="flex items-center gap-2">
        <div className="w-full sm:w-40">
          <Input
            type="date"
            placeholder="من تاريخ"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <span className="text-slate-400 text-xs font-bold">إلى</span>

        <div className="w-full sm:w-40">
          <Input
            type="date"
            placeholder="إلى تاريخ"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            title={t('common.clearFilters')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
