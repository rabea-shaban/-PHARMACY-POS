import React from 'react';
import { useTranslation } from 'react-i18next';
import { Expense } from '../types/expense.types.js';
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  isLoading,
  onDelete,
  pagination,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

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
              <th className="py-3.5 px-4 text-start">بند المصروف</th>
              <th className="py-3.5 px-4 text-start">الوصف والبيان</th>
              <th className="py-3.5 px-4 text-start">المبلغ</th>
              <th className="py-3.5 px-4 text-start">طريقة الدفع</th>
              <th className="py-3.5 px-4 text-start">تاريخ الصرف</th>
              <th className="py-3.5 px-4 text-start">المسؤول</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {expenses.map((e: Expense) => (
              <tr
                key={e.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Category */}
                <td className="py-3.5 px-4">
                  <ExpenseCategoryBadge category={e.category} />
                </td>

                {/* Description */}
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                  <Link
                    to={`/expenses/${e.id}`}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {e.description}
                  </Link>
                </td>

                {/* Amount */}
                <td className="py-3.5 px-4 font-black font-mono text-rose-600 dark:text-rose-400 text-sm">
                  {formatCurrency(e.amount)}
                </td>

                {/* Payment Method */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>{e.paymentMethod}</span>
                  </div>
                </td>

                {/* Expense Date */}
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  {formatDate(e.expenseDate)}
                </td>

                {/* Created By */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {e.createdByName}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/expenses/${e.id}`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {canEdit && (
                      <>
                        <Link
                          to={`/expenses/${e.id}/edit`}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 transition-colors"
                          title={t('common.edit')}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(e.id)}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
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
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
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
