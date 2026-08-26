import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExpenseReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Wallet, PieChart, CreditCard } from 'lucide-react';

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

  const { summary, categoryBreakdown, paymentMethodBreakdown } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">إجمالي المصروفات التشغيلية</span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.totalExpenses)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            عدد {summary.expensesCount} سند صرف
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">متوسط قيمة سند الصرف</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {formatCurrency(summary.averageExpenseAmount)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            متوسط التكلفة للعملية الواحدة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">طرق السداد</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
            {paymentMethodBreakdown.map((pm) => (
              <div key={pm.paymentMethod} className="flex justify-between">
                <span>{pm.paymentMethod}:</span>
                <span className="font-mono">{formatCurrency(pm.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-600" />
            <CardTitle className="text-sm">توزيع المصروفات حسب التصنيف والنسبة</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">تصنيف المصروف</th>
                  <th className="py-3 px-4 text-end">عدد السندات</th>
                  <th className="py-3 px-4 text-end">النسبة المئوية</th>
                  <th className="py-3 px-4 text-end">إجمالي المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {categoryBreakdown.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{cat.category}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-end">
                      {cat.count} سند
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 text-end">
                      {cat.percentage}%
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-rose-600 dark:text-rose-400 text-end">
                      {formatCurrency(cat.amount)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
