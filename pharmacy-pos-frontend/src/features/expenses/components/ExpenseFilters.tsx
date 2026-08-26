import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../components/ui/Input.js';
import { Search, X } from 'lucide-react';

export interface ExpenseFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  onReset: () => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  paymentMethod,
  onPaymentMethodChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const hasFilters = Boolean(search || category || paymentMethod);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
      <div className="flex-1">
        <Input
          placeholder="ابحث في وصف المصروف..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="w-full sm:w-44">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">جميع بنود المصروفات</option>
          <option value="RENT">إيجار الصيدلية</option>
          <option value="ELECTRICITY">كهرباء ومرافق</option>
          <option value="MAINTENANCE">صيانة وتصليحات</option>
          <option value="SUPPLIES">أدوات ومستلزمات</option>
          <option value="SALARY">رواتب وعمالة</option>
          <option value="OTHER">نثريات ومصروفات عامة</option>
        </select>
      </div>

      <div className="w-full sm:w-40">
        <select
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">طريقة الدفع (الكل)</option>
          <option value="CASH">نقدي (Cash)</option>
          <option value="VISA">فيزا (Visa)</option>
          <option value="WALLET">محفظة (Wallet)</option>
          <option value="OTHER">أخرى</option>
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
