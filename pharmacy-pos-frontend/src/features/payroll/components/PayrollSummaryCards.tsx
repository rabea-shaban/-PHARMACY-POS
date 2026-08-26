import React from 'react';
import { useTranslation } from 'react-i18next';
import { PayrollSummary } from '../types/payroll.types.js';
import { Card } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Coins, CheckCircle2, Clock, Users, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface PayrollSummaryCardsProps {
  summary: PayrollSummary;
}

export const PayrollSummaryCards: React.FC<PayrollSummaryCardsProps> = ({ summary }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Payable */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
            إجمالي مسيرات الرواتب
          </span>
          <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          {formatCurrency(summary.totalPayrollPayable)} {t('common.currency')}
        </div>
        <p className="text-[11px] text-slate-500 mt-1 font-bold">
          لعدد {summary.totalEmployeesCount} موظف مسجل
        </p>
      </Card>

      {/* Paid Amount */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            الرواتب المصروفة (المدفوعة)
          </span>
          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          {formatCurrency(summary.totalPaidAmount)} {t('common.currency')}
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
          تم صرفها وتسويتها بالكامل
        </p>
      </Card>

      {/* Pending Amount */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
            رواتب بانتظار الصرف
          </span>
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          {formatCurrency(summary.totalPendingAmount)} {t('common.currency')}
        </div>
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
          مستحقات معتمدة ومسودات
        </p>
      </Card>

      {/* Net Commission & Bonuses Breakdown */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
            الحوافز والعمولات
          </span>
          <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 inline" />
              +{formatCurrency(summary.totalBonuses + summary.totalCommissionPaid)}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-rose-500 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5 inline" />
              -{formatCurrency(summary.totalDeductions)}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          عمولات: {formatCurrency(summary.totalCommissionPaid)} | استقطاعات: {formatCurrency(summary.totalDeductions)}
        </p>
      </Card>
    </div>
  );
};
