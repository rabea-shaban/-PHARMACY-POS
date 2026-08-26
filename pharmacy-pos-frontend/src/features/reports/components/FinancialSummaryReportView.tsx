import React from 'react';
import { FinancialSummaryResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Landmark, ArrowUpRight, ArrowDownRight, Wallet, ShoppingBag, Truck, Award } from 'lucide-react';

export interface FinancialSummaryReportViewProps {
  data: FinancialSummaryResponse;
  isLoading: boolean;
}

export const FinancialSummaryReportView: React.FC<FinancialSummaryReportViewProps> = ({ data, isLoading }) => {
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
        className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border print:border-slate-900 print:bg-slate-50 print:shadow-none ${
          isPositive
            ? 'bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300 dark:border-emerald-900'
            : 'bg-linear-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-300 dark:border-rose-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-6 h-6 text-sky-600 dark:text-sky-400 print:hidden" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white print:text-black">
                صافي الفائض / التدفق التشغيلي للفترة (Net Operational Cash Movement)
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-600 mt-1 font-bold">
              (صافي المبيعات) - (المشتريات المستلمة + المصروفات التشغيلية + عمولات المبيعات)
            </p>
          </div>

          <div className="text-end">
            <span
              className={`text-xl sm:text-3xl font-black font-mono flex items-center justify-end gap-1 ${
                isPositive
                  ? 'text-emerald-700 dark:text-emerald-400 print:text-emerald-800'
                  : 'text-rose-700 dark:text-rose-400 print:text-rose-800'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 print:hidden" /> : <ArrowDownRight className="w-6 h-6 sm:w-8 sm:h-8 print:hidden" />}
              {formatCurrency(metrics.netOperationalMovement)}
            </span>
          </div>
        </div>
      </Card>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Net Sales */}
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 print:text-slate-900">
              صافي المبيعات المحققة
            </span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 print:hidden">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            +{formatCurrency(metrics.netSales)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-bold">
            إجمالي: {formatCurrency(metrics.grossSales)} | مرتجع: {formatCurrency(metrics.returnsAndRefunds)}
          </p>
        </Card>

        {/* Purchases Cost */}
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-slate-900">
              تكلفة المشتريات المستلمة
            </span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 print:hidden">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            -{formatCurrency(metrics.receivedPurchasesCost)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-bold">
            بضائع وأدوية تم إدخالها للمخزن
          </p>
        </Card>

        {/* Operating Expenses */}
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 print:text-slate-900">
              المصروفات التشغيلية
            </span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 print:hidden">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 print:text-black font-mono">
            -{formatCurrency(metrics.operatingExpenses)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-bold">
            إيجار، كهرباء، صيانة، مستلزمات
          </p>
        </Card>

        {/* Staff Commissions */}
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 print:text-slate-900">
              عمولات وحوافز البيع
            </span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 print:hidden">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 print:text-black font-mono">
            -{formatCurrency(metrics.netStaffCommissions)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-bold">
            حوافز أداء الصيادلة
          </p>
        </Card>
      </div>

      {/* P&L Breakdown Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300 print:shadow-none">
        <CardHeader className="pb-3 border-b-2 border-slate-200 dark:border-[#1E293B] print:border-slate-300">
          <CardTitle className="text-sm font-black text-slate-900 dark:text-white print:text-black">
            بيان حركة الدخل والتشغيل التفصيلي (P&L Income Statement)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs font-mono">
            <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B] print:divide-slate-300">
              <tr className="bg-sky-50/40 dark:bg-sky-950/10 print:bg-slate-50">
                <td className="py-3 px-5 font-sans font-bold text-slate-800 dark:text-slate-200 print:text-black">
                  إجمالي إيرادات المبيعات (Gross Revenue)
                </td>
                <td className="py-3 px-5 text-end font-bold text-slate-900 dark:text-white print:text-black">
                  +{formatCurrency(metrics.grossSales)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans font-bold text-rose-600">
                  مرتجعات واستردادات المبيعات (Sales Returns & Refunds)
                </td>
                <td className="py-3 px-5 text-end font-bold text-rose-600">
                  -{formatCurrency(metrics.returnsAndRefunds)}
                </td>
              </tr>
              <tr className="bg-slate-100 dark:bg-[#0B0F17]/50 print:bg-slate-100 font-black">
                <td className="py-3 px-5 font-sans text-slate-900 dark:text-white print:text-black">
                  صافي الإيراد الفعلي (Net Revenue)
                </td>
                <td className="py-3 px-5 text-end font-black text-sky-700 dark:text-sky-400 print:text-black">
                  +{formatCurrency(metrics.netSales)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans text-slate-700 dark:text-slate-300 print:text-black font-bold">
                  تكلفة المشتريات والتوريد المستلمة (Cost of Goods Received)
                </td>
                <td className="py-3 px-5 text-end font-bold text-slate-800 dark:text-slate-200 print:text-black">
                  -{formatCurrency(metrics.receivedPurchasesCost)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans text-slate-700 dark:text-slate-300 print:text-black font-bold">
                  إجمالي المصروفات التشغيلية (Operating Expenses)
                </td>
                <td className="py-3 px-5 text-end font-bold text-rose-600">
                  -{formatCurrency(metrics.operatingExpenses)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans text-slate-700 dark:text-slate-300 print:text-black font-bold">
                  صافي عمولات الموظفين البيعية (Staff Sales Commissions)
                </td>
                <td className="py-3 px-5 text-end font-bold text-amber-600">
                  -{formatCurrency(metrics.netStaffCommissions)}
                </td>
              </tr>
              <tr className="bg-slate-200 dark:bg-[#0B0F17] print:bg-slate-200 border-t-2 border-slate-900 dark:border-white font-black text-sm">
                <td className="py-4 px-5 font-sans text-slate-900 dark:text-white print:text-black">
                  صافي الحركة التشغيلية للفترة (Net Operational Movement)
                </td>
                <td
                  className={`py-4 px-5 text-end font-black text-base ${
                    isPositive
                      ? 'text-emerald-800 dark:text-emerald-400 print:text-black'
                      : 'text-rose-800 dark:text-rose-400 print:text-black'
                  }`}
                >
                  {formatCurrency(metrics.netOperationalMovement)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
