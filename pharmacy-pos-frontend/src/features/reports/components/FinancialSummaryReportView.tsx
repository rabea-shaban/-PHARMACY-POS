import React from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialSummaryResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Landmark, ArrowUpRight, ArrowDownRight, Wallet, ShoppingBag, Truck, Award } from 'lucide-react';

export interface FinancialSummaryReportViewProps {
  data: FinancialSummaryResponse;
  isLoading: boolean;
}

export const FinancialSummaryReportView: React.FC<FinancialSummaryReportViewProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics } = data;
  const isPositive = metrics.netOperationalMovement >= 0;

  return (
    <div className="space-y-6">
      {/* Executive Net Movement Banner */}
      <Card
        className={`p-6 rounded-3xl border ${
          isPositive
            ? 'bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300 dark:border-emerald-900'
            : 'bg-linear-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-300 dark:border-rose-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                صافي الفائض / التدفق التشغيلي للفترة
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              (صافي المبيعات) - (المشتريات المستلمة + المصروفات التشغيلية + عمولات المبيعات)
            </p>
          </div>

          <div className="text-end">
            <span
              className={`text-2xl sm:text-3xl font-black font-mono flex items-center justify-end gap-1 ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
              {formatCurrency(metrics.netOperationalMovement)} {t('common.currency')}
            </span>
          </div>
        </div>
      </Card>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Sales */}
        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">صافي المبيعات المحققة</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            +{formatCurrency(metrics.netSales)} {t('common.currency')}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            إجمالي: {formatCurrency(metrics.grossSales)} | مرتجع: {formatCurrency(metrics.returnsAndRefunds)}
          </p>
        </Card>

        {/* Purchases Cost */}
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">تكلفة المشتريات المستلمة</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            -{formatCurrency(metrics.receivedPurchasesCost)} {t('common.currency')}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            بضائع وأدوية تم إدخالها للمخزن
          </p>
        </Card>

        {/* Operating Expenses */}
        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">المصروفات التشغيلية</span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            -{formatCurrency(metrics.operatingExpenses)} {t('common.currency')}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            إيجار، كهرباء، صيانة، مستلزمات
          </p>
        </Card>

        {/* Staff Commissions */}
        <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">عمولات وحوافز البيع</span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            -{formatCurrency(metrics.netStaffCommissions)} {t('common.currency')}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            حوافز أداء الصيادلة
          </p>
        </Card>
      </div>

      {/* P&L Breakdown Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">بيان حركة الدخل والتشغيل التفصيلي (P&L Income Statement)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
              <tr className="bg-sky-50/30 dark:bg-sky-950/10">
                <td className="py-3 px-5 font-bold text-slate-800 dark:text-slate-200">
                  إجمالي إيرادات المبيعات (Gross Revenue)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-slate-900 dark:text-white">
                  +{formatCurrency(metrics.grossSales)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-bold text-rose-600">
                  مرتجعات واستردادات المبيعات (Sales Returns & Refunds)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-rose-600">
                  -{formatCurrency(metrics.returnsAndRefunds)} {t('common.currency')}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-[#0B0F17]/50 font-black">
                <td className="py-3 px-5 text-slate-900 dark:text-white">
                  صافي الإيراد الفعلي (Net Revenue)
                </td>
                <td className="py-3 px-5 text-end font-mono font-black text-sky-600 dark:text-sky-400">
                  +{formatCurrency(metrics.netSales)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-700 dark:text-slate-300 font-bold">
                  تكلفة المشتريات والتوريد المستلمة (Cost of Goods Received)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-slate-800 dark:text-slate-200">
                  -{formatCurrency(metrics.receivedPurchasesCost)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-700 dark:text-slate-300 font-bold">
                  إجمالي المصروفات التشغيلية (Operating Expenses)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-rose-600">
                  -{formatCurrency(metrics.operatingExpenses)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-700 dark:text-slate-300 font-bold">
                  صافي عمولات الموظفين البيعية (Staff Sales Commissions)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-amber-600">
                  -{formatCurrency(metrics.netStaffCommissions)} {t('common.currency')}
                </td>
              </tr>
              <tr className="bg-slate-100 dark:bg-[#0B0F17] border-t-2 border-slate-900 dark:border-white font-black text-sm">
                <td className="py-4 px-5 text-slate-900 dark:text-white">
                  صافي الحركة التشغيلية (Net Operational Movement)
                </td>
                <td
                  className={`py-4 px-5 text-end font-mono font-black text-base ${
                    isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatCurrency(metrics.netOperationalMovement)} {t('common.currency')}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
