import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExpenseReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Wallet, PieChart as PieIcon, CreditCard, Calendar } from 'lucide-react';

export interface ExpenseReportViewProps {
  data: ExpenseReportResponse;
  isLoading: boolean;
}

export const ExpenseReportView: React.FC<ExpenseReportViewProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, categoryBreakdown, paymentMethodBreakdown, dailyTrend } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 print:text-slate-900">
              إجمالي المصروفات التشغيلية
            </span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 print:hidden">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {formatCurrency(summary.totalExpenses)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            عدد {summary.expensesCount} سند صرف
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-slate-900">
              متوسط قيمة سند الصرف
            </span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 print:hidden">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-indigo-600 dark:text-indigo-400 print:text-black font-mono">
            {formatCurrency(summary.averageExpenseAmount)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            متوسط التكلفة للعملية الواحدة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 print:text-slate-900">
              طرق السداد المالي
            </span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 print:hidden">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300 print:text-black space-y-1">
            {paymentMethodBreakdown.map((pm) => (
              <div key={pm.paymentMethod} className="flex justify-between">
                <span>{pm.paymentMethod}:</span>
                <span className="font-mono">{formatCurrency(pm.amount)} {t('common.currency')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-600 print:hidden" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
              جدول بيان وتوزيع المصروفات حسب البنود والتصنيف
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">تصنيف وبند المصروف</th>
                  <th className="py-3 px-4 text-center">عدد السندات</th>
                  <th className="py-3 px-4 text-center">النسبة المئوية</th>
                  <th className="py-3 px-4 text-end">إجمالي المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200">
                {categoryBreakdown.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {cat.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-center text-slate-700 dark:text-slate-300 print:text-black">
                      {cat.count} سند
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-center text-sky-600 dark:text-sky-400 print:text-black">
                      {cat.percentage}%
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-rose-600 dark:text-rose-400 print:text-black text-end">
                      {formatCurrency(cat.amount)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 print:bg-slate-100 font-bold border-t-2 border-slate-900">
                <tr>
                  <td className="py-3 px-4 text-slate-900 font-black">إجمالي المصروفات التشغيلية</td>
                  <td className="py-3 px-4 text-center font-mono">{summary.expensesCount} سند</td>
                  <td className="py-3 px-4 text-center font-mono">100%</td>
                  <td className="py-3 px-4 text-end font-mono font-black text-sm text-rose-700 print:text-black">
                    {formatCurrency(summary.totalExpenses)} {t('common.currency')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Daily Expenses Ledger Table */}
      {dailyTrend && dailyTrend.length > 0 && (
        <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600 print:hidden" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                جدول حركة المصروفات اليومية خلال الفترة
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4 text-start">التاريخ</th>
                  <th className="py-2.5 px-4 text-center">عدد سندات الصرف</th>
                  <th className="py-2.5 px-4 text-end">إجمالي المنصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200 font-mono">
                {dailyTrend.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {formatDate(d.date)}
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600">
                      {d.count} سند
                    </td>
                    <td className="py-2.5 px-4 font-bold text-end text-rose-600 dark:text-rose-400 print:text-black">
                      {formatCurrency(d.amount)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
