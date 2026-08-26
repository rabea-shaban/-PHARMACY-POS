import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommissionSummary } from '../types/commission.types.js';
import { Card } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Award, TrendingUp, Users, ShoppingBag } from 'lucide-react';

export interface CommissionSummaryCardsProps {
  summary: CommissionSummary;
}

export const CommissionSummaryCards: React.FC<CommissionSummaryCardsProps> = ({ summary }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Commissions Paid */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
            إجمالي العمولات المكتسبة
          </span>
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          +{formatCurrency(summary.totalCommissionsPaid)} {t('common.currency')}
        </div>
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
          حوافز تشجيعية للمبيعات
        </p>
      </Card>

      {/* Eligible Sales Volume */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
            حجم المبيعات المؤهلة للعمولة
          </span>
          <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          {formatCurrency(summary.totalSalesVolume)} {t('common.currency')}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-bold">
          إجمالي مبيعات فواتير العمولات
        </p>
      </Card>

      {/* Transactions Count */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            عدد عمليات احتساب العمولة
          </span>
          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          {summary.transactionsCount.toLocaleString()} عملية
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
          حركة بيع مستحقة
        </p>
      </Card>

      {/* Staff Count */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
            الصيادلة والموظفون المستفيدون
          </span>
          <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
          {summary.staffSummary?.length || 0} موظف
        </div>
        <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-bold">
          مستحقون للعمولات هذا الشهر
        </p>
      </Card>
    </div>
  );
};
