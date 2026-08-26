import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../../users/hooks/useUsers.js';
import { Input } from '../../../components/ui/Input.js';
import { X, Calendar, User } from 'lucide-react';

export interface CommissionFiltersProps {
  userId: string;
  onUserIdChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onReset: () => void;
}

export const CommissionFilters: React.FC<CommissionFiltersProps> = ({
  userId,
  onUserIdChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const { data: usersData } = useUsers({ limit: 100, isActive: true });
  const staff = usersData?.items || [];
  const hasFilters = Boolean(userId || startDate || endDate);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
      <div className="flex-1 sm:w-64">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <select
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            className="w-full rounded-2xl border py-2.5 ps-9 pe-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="">جميع الموظفين والصيادلة</option>
            {staff.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full sm:w-44">
        <Input
          type="date"
          placeholder="من تاريخ"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
        />
      </div>

      <div className="w-full sm:w-44">
        <Input
          type="date"
          placeholder="إلى تاريخ"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
        />
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
