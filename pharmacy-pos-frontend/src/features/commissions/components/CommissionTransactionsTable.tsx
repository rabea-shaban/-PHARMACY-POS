import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommissionTransaction } from '../types/commission.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import {
  User,
  Receipt,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface CommissionTransactionsTableProps {
  transactions: CommissionTransaction[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const CommissionTransactionsTable: React.FC<CommissionTransactionsTableProps> = ({
  transactions,
  isLoading,
  pagination,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
        {[...Array(5)].map((_, i) => (
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
              <th className="py-3.5 px-4 text-start">الموظف / الصيدلي</th>
              <th className="py-3.5 px-4 text-start">رقم فاتورة البيع</th>
              <th className="py-3.5 px-4 text-start">قاعدة العمولة</th>
              <th className="py-3.5 px-4 text-start">قيمة المبيعات</th>
              <th className="py-3.5 px-4 text-start">نسبة العمولة</th>
              <th className="py-3.5 px-4 text-start font-black text-slate-900 dark:text-white">
                مبلغ العمولة
              </th>
              <th className="py-3.5 px-4 text-start">تاريخ الحركة</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* User */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {tx.userName || 'موظف'}
                    </span>
                  </div>
                  {tx.userRole && (
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                      {tx.userRole}
                    </span>
                  )}
                </td>

                {/* Sale Invoice */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {tx.invoiceNumber ? (
                    <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                      <Receipt className="w-3.5 h-3.5" />
                      <span>#{tx.invoiceNumber}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Commission Rule */}
                <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{tx.commissionRuleName || 'النسبة الافتراضية'}</span>
                  </div>
                </td>

                {/* Sales Amount */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {formatCurrency(tx.salesAmount)} {t('common.currency')}
                </td>

                {/* Commission Rate */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                  {tx.commissionRate}%
                </td>

                {/* Commission Amount */}
                <td className="py-3.5 px-4 font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                  +{formatCurrency(tx.commissionAmount)} {t('common.currency')}
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                  {formatDate(tx.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  {tx.saleId && (
                    <Link
                      to={`/sales/${tx.saleId}`}
                      className="p-1.5 inline-flex rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                      title="عرض تفاصيل فاتورة البيع"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0B0F17]/40">
          <p className="text-xs text-slate-500">
            {t('common.showing')} {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')}{' '}
            {pagination.total}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <span className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
