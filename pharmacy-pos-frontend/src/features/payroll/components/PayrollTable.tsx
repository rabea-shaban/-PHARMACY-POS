import React from 'react';
import { useTranslation } from 'react-i18next';
import { Payroll } from '../types/payroll.types.js';
import { PayrollStatusBadge } from './PayrollStatusBadge.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import {
  Eye,
  CheckCircle2,
  CreditCard,
  Printer,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface PayrollTableProps {
  payrolls: Payroll[];
  isLoading: boolean;
  onApprove?: (payroll: Payroll) => void;
  onPay?: (payroll: Payroll) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  payrolls,
  isLoading,
  onApprove,
  onPay,
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
              <th className="py-3.5 px-4 text-start">الموظف</th>
              <th className="py-3.5 px-4 text-start">فترة المسير</th>
              <th className="py-3.5 px-4 text-start">الراتب الأساسي</th>
              <th className="py-3.5 px-4 text-start">العمولات</th>
              <th className="py-3.5 px-4 text-start">حوافز / خصومات</th>
              <th className="py-3.5 px-4 text-start font-black text-slate-900 dark:text-white">صافي الراتب</th>
              <th className="py-3.5 px-4 text-start">الحالة</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {payrolls.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Employee Name & Phone */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {p.employeeName}
                    </span>
                  </div>
                  {p.employeePhone && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                      <Phone className="w-2.5 h-2.5" />
                      <span>{p.employeePhone}</span>
                    </div>
                  )}
                </td>

                {/* Period */}
                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                  <span>{formatDate(p.periodStart)}</span>
                  <span className="text-slate-400 mx-1">إلى</span>
                  <span>{formatDate(p.periodEnd)}</span>
                </td>

                {/* Base Salary */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {formatCurrency(p.baseSalary)} {t('common.currency')}
                </td>

                {/* Commission */}
                <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                  +{formatCurrency(p.commission)}
                </td>

                {/* Bonus / Deductions */}
                <td className="py-3.5 px-4 font-mono text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    +{formatCurrency(p.bonus)}
                  </span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-rose-500 font-bold">
                    -{formatCurrency(p.deductions)}
                  </span>
                </td>

                {/* Net Salary */}
                <td className="py-3.5 px-4 font-mono font-black text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0B0F17]/30">
                  {formatCurrency(p.netSalary)} {t('common.currency')}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <PayrollStatusBadge status={p.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <Link
                      to={`/payroll/${p.id}`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {/* Salary Slip Print Link */}
                    <Link
                      to={`/payroll/${p.id}/slip`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-indigo-50 dark:hover:bg-[#1E293B] text-indigo-600 dark:text-indigo-400 transition-colors"
                      title="طباعة قسيمة الراتب (Salary Slip)"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Link>

                    {/* Approve Action */}
                    {p.status === 'DRAFT' && onApprove && (
                      <button
                        type="button"
                        onClick={() => onApprove(p)}
                        className="p-1.5 rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors cursor-pointer"
                        title="اعتماد المسير (Approve)"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Pay Action */}
                    {p.status === 'PENDING' && onPay && (
                      <button
                        type="button"
                        onClick={() => onPay(p)}
                        className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                        title="صرف وتسوية الراتب (Pay)"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
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
