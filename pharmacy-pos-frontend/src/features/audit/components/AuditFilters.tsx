import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../components/ui/Input.js';
import { Search, X, Calendar } from 'lucide-react';

export interface AuditFiltersProps {
  entity: string;
  onEntityChange: (val: string) => void;
  action: string;
  onActionChange: (val: string) => void;
  from: string;
  onFromChange: (val: string) => void;
  to: string;
  onToChange: (val: string) => void;
  onReset: () => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  entity,
  onEntityChange,
  action,
  onActionChange,
  from,
  onFromChange,
  to,
  onToChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const hasFilters = Boolean(entity || action || from || to);

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search by Entity / Resource */}
        <div>
          <Input
            placeholder="بحث بالكيان (Product, Sale, User...)"
            value={entity}
            onChange={(e) => onEntityChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter by Action */}
        <div>
          <select
            value={action}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="">جميع العمليات (Actions)</option>
            <option value="CREATE">إنشاء وإضافة (CREATE)</option>
            <option value="UPDATE">تعديل وتحديث (UPDATE)</option>
            <option value="DELETE">حذف وإلغاء (DELETE)</option>
            <option value="LOGIN">تسجيل دخول (LOGIN)</option>
            <option value="SALE">فواتير بيع (SALE)</option>
            <option value="PAYMENT">مدفوعات (PAYMENT)</option>
            <option value="RETURN">مرتجعات (RETURN)</option>
            <option value="INVENTORY_ADJUSTMENT">تسوية مخزون (ADJUST)</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <Input
            type="date"
            placeholder="من تاريخ"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* To Date */}
        <div>
          <Input
            type="date"
            placeholder="إلى تاريخ"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {hasFilters && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t('common.clearFilters')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
