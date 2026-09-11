import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../reports/api/reportsApi.js';
import { Landmark, ArrowRight, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../lib/utils.js';

export const FinancialHealthWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data: finData, isLoading } = useQuery({
    queryKey: ['reports', 'financial-summary-widget'],
    queryFn: () => reportsApi.getFinancialSummary(),
    staleTime: 60 * 1000,
  });

  const grossSales = finData?.metrics?.grossSales ?? 0;
  const netSales = finData?.metrics?.netSales ?? 0;
  const totalExpenses = finData?.metrics?.operatingExpenses ?? 0;
  const netProfit = finData?.metrics?.netOperationalMovement ?? (netSales - totalExpenses);
  const profitMargin = netSales > 0 ? ((netProfit / netSales) * 100).toFixed(1) : '0';

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">{t('dashboard.financialOverviewTitle')}</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('dashboard.financialOverviewSubtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/finance"
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>{t('dashboard.actionFinance')}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                <span>صافي الإيرادات (Net Sales)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {formatCurrency(netSales)}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                إجمالي الفواتير: {formatCurrency(grossSales)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-300 mb-1">
                <span>المصروفات التشغيلية</span>
                <Wallet className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-1">
                تشمل الإيجارات وفواتير التشغيل
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
              <div className="flex items-center justify-between text-xs font-bold text-sky-800 dark:text-sky-300 mb-1">
                <span>صافي الأرباح التشغيلية</span>
                <DollarSign className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {formatCurrency(netProfit)}
              </div>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 mt-1 font-bold">
                هامش الربح: {profitMargin}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
