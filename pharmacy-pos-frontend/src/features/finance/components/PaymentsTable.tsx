import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentRecord } from '../types/payment.types.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight, CreditCard, Receipt } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface PaymentsTableProps {
  payments: PaymentRecord[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
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
              <th className="py-3.5 px-4 text-start">رقم الفاتورة / المرجع</th>
              <th className="py-3.5 px-4 text-start">المبلغ المدفوع</th>
              <th className="py-3.5 px-4 text-start">طريقة الدفع</th>
              <th className="py-3.5 px-4 text-start">الموظف المسؤول</th>
              <th className="py-3.5 px-4 text-start">التاريخ والوقت</th>
              <th className="py-3.5 px-4 text-start">ملاحظات</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {payments.map((p: PaymentRecord) => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Invoice / Reference */}
                <td className="py-3.5 px-4">
                  {p.saleId ? (
                    <Link
                      to={`/sales/${p.saleId}`}
                      className="font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{p.invoiceNumber || p.saleId.slice(0, 8)}</span>
                    </Link>
                  ) : (
                    <span className="font-mono text-slate-400">—</span>
                  )}
                </td>

                {/* Amount */}
                <td className="py-3.5 px-4 font-black font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatCurrency(p.amount)}
                </td>

                {/* Payment Method */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.paymentMethod}</span>
                  </div>
                </td>

                {/* Staff */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {p.createdByName}
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  {formatDate(p.createdAt)}
                </td>

                {/* Notes / Reference */}
                <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                  {p.referenceNumber ? `مرجع: ${p.referenceNumber}` : p.notes || '—'}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  {p.saleId && (
                    <Link
                      to={`/sales/${p.saleId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 font-bold transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض الفاتورة</span>
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
