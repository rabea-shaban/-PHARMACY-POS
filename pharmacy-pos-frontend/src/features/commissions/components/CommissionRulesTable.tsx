import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommissionRule } from '../types/commission.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Sparkles, Edit, CheckCircle2, XCircle } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface CommissionRulesTableProps {
  rules: CommissionRule[];
  isLoading: boolean;
  onEdit: (rule: CommissionRule) => void;
  onToggleStatus: (rule: CommissionRule) => void;
}

export const CommissionRulesTable: React.FC<CommissionRulesTableProps> = ({
  rules,
  isLoading,
  onEdit,
  onToggleStatus,
}) => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);
  const canManage = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3.5 px-4 text-start">اسم القاعدة</th>
              <th className="py-3.5 px-4 text-start">نسبة العمولة (%)</th>
              <th className="py-3.5 px-4 text-start">مبلغ ثابت إضافي</th>
              <th className="py-3.5 px-4 text-start">تاريخ السريان</th>
              <th className="py-3.5 px-4 text-start">الحالة</th>
              {canManage && <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {rules.map((rule) => (
              <tr
                key={rule.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Rule Name */}
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>{rule.name}</span>
                  </div>
                </td>

                {/* Percentage */}
                <td className="py-3.5 px-4 font-mono font-black text-sm text-sky-600 dark:text-sky-400">
                  {rule.percentage}%
                </td>

                {/* Fixed Amount */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {rule.fixedAmount ? `${formatCurrency(rule.fixedAmount)} ${t('common.currency')}` : '—'}
                </td>

                {/* Effective Date */}
                <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                  {formatDate(rule.effectiveDate)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  {rule.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>نشطة ومطبقة</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <XCircle className="w-3 h-3 text-slate-500" />
                      <span>غير مفعلة</span>
                    </span>
                  )}
                </td>

                {/* Actions */}
                {canManage && (
                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(rule)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
                        title="تعديل قاعدة العمولة"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(rule)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          rule.isActive
                            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100'
                        }`}
                        title={rule.isActive ? 'تعطيل القاعدة' : 'تفعيل القاعدة'}
                      >
                        {rule.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
