import React from 'react';
import { FinancialMetrics } from '../types/finance.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { TrendingUp, ShoppingBag, RotateCcw, Truck, Wallet, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface FinancialMetricsCardsProps {
  metrics?: FinancialMetrics;
  isLoading: boolean;
}

export const FinancialMetricsCards: React.FC<FinancialMetricsCardsProps> = ({
  metrics,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  const grossSales = metrics?.grossSales || 0;
  const returns = metrics?.returnsAndRefunds || 0;
  const netSales = metrics?.netSales || 0;
  const purchasesCost = metrics?.receivedPurchasesCost || 0;
  const expenses = metrics?.operatingExpenses || 0;
  const commissions = metrics?.netStaffCommissions || 0;
  const netMovement = metrics?.netOperationalMovement || 0;

  return (
    <div className="space-y-4">
      {/* Primary Row: Net Movement, Net Sales, Purchases, Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Operational Movement */}
        <Card
          className={`rounded-3xl shadow-xs border ${
            netMovement >= 0
              ? 'border-emerald-200 dark:border-emerald-900/50 bg-linear-to-br from-white via-emerald-50/20 to-white dark:from-[#131B2A] dark:via-[#152723] dark:to-[#131B2A]'
              : 'border-rose-200 dark:border-rose-900/50 bg-linear-to-br from-white via-rose-50/20 to-white dark:from-[#131B2A] dark:via-[#271515] dark:to-[#131B2A]'
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                صافي الحركة التشغيلية (Net Cash Flow)
              </p>
              <p
                className={`text-xl font-black font-mono mt-1 ${
                  netMovement >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatCurrency(netMovement)}
              </p>
            </div>
            <div
              className={`p-3 rounded-2xl ${
                netMovement >= 0
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              }`}
            >
              {netMovement >= 0 ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Net Sales */}
        <Card className="rounded-3xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                صافي المبيعات (Net Sales)
              </p>
              <p className="text-xl font-black text-sky-600 dark:text-sky-400 font-mono mt-1">
                {formatCurrency(netSales)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Received Purchases Cost */}
        <Card className="rounded-3xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                مشتريات الأدوية المستلمة
              </p>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {formatCurrency(purchasesCost)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Operating Expenses */}
        <Card className="rounded-3xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                المصروفات والنثريات التشغيلية
              </p>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                {formatCurrency(expenses)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Wallet className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Gross Sales, Returns & Refunds, Staff Commissions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              إجمالي مبيعات الفواتير:
            </span>
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
            {formatCurrency(grossSales)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              المرتجعات والمستردات:
            </span>
          </div>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
            -{formatCurrency(returns)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              عمولات الصيادلة والموظفين:
            </span>
          </div>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">
            {formatCurrency(commissions)}
          </span>
        </div>
      </div>
    </div>
  );
};
