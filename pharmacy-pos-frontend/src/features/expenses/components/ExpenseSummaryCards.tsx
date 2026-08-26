import React from 'react';
import { ExpenseSummary } from '../types/expense.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { Wallet, DollarSign, Receipt } from 'lucide-react';

export interface ExpenseSummaryCardsProps {
  summary?: ExpenseSummary;
  isLoading: boolean;
}

export const ExpenseSummaryCards: React.FC<ExpenseSummaryCardsProps> = ({
  summary,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  const total = summary?.totalExpenses || 0;
  const count = summary?.expensesCount || 0;
  const avg = count > 0 ? total / count : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Expenses */}
      <Card className="rounded-3xl shadow-xs border-rose-100 dark:border-[#223049] bg-linear-to-br from-white via-rose-50/20 to-white dark:from-[#131B2A] dark:via-[#1E202B] dark:to-[#131B2A]">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              إجمالي المصروفات التشغيلية
            </p>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Wallet className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Expenses Count */}
      <Card className="rounded-3xl shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              عدد سندات الصرف
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {count} <span className="text-xs font-bold text-slate-400">سند</span>
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
            <Receipt className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Average Expense Value */}
      <Card className="rounded-3xl shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              متوسط قيمة السند
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {formatCurrency(avg)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
