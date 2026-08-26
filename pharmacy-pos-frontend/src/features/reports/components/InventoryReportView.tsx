import React from 'react';
import { InventoryReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Boxes, ShieldAlert, CheckCircle2, Clock, AlertOctagon, TrendingUp } from 'lucide-react';

export interface InventoryReportViewProps {
  data: InventoryReportResponse;
  isLoading: boolean;
}

export const InventoryReportView: React.FC<InventoryReportViewProps> = ({ data, isLoading }) => {
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

  const { summary, health, lowStockItems } = data;

  return (
    <div className="space-y-6">
      {/* Valuation & Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-slate-900">
              القيمة التقديرية بسعر التكلفة
            </span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 print:hidden">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {formatCurrency(summary.derivableInventoryCostValue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            تكلفة البضاعة في المخزن
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 print:text-slate-900">
              القيمة التقديرية بسعر البيع
            </span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 print:hidden">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 print:text-black font-mono">
            {formatCurrency(summary.derivableInventoryRetailValue)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 print:text-slate-600 mt-1 font-bold">
            إجمالي العائد المتوقع عند البيع
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 print:text-slate-900">
              إجمالي الوحدات والعبوات
            </span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 print:hidden">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {summary.totalStockUnits.toLocaleString()} عبوة
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            في {summary.totalActiveBatches} تشغيلة فعالة
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 print:text-slate-900">
              أصناف قاربت على النفاد
            </span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 print:hidden">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 print:text-black font-mono">
            {health.lowStockProductsCount} صنف
          </div>
          <p className="text-[11px] text-rose-500 print:text-slate-600 mt-1 font-bold">
            أقل من حد الطلب الأدنى
          </p>
        </Card>
      </div>

      {/* Stock Health Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 print:border-slate-300 print:bg-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 print:hidden" />
            <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 print:text-slate-900">
              مخزون سليم وفعال الصلاحية
            </span>
          </div>
          <p className="mt-1.5 text-base sm:text-lg font-black font-mono text-emerald-700 dark:text-emerald-300 print:text-black">
            {health.healthyStockUnits.toLocaleString()} عبوة
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 print:border-slate-300 print:bg-white">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 print:hidden" />
            <span className="font-bold text-xs text-amber-900 dark:text-amber-200 print:text-slate-900">
              ينتهي خلال 90 يوماً (قريب الانتهاء)
            </span>
          </div>
          <p className="mt-1.5 text-base sm:text-lg font-black font-mono text-amber-700 dark:text-amber-300 print:text-black">
            {health.expiringSoonStockUnits.toLocaleString()} عبوة
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 print:border-slate-300 print:bg-white">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600 print:hidden" />
            <span className="font-bold text-xs text-rose-900 dark:text-rose-200 print:text-slate-900">
              منتهي الصلاحية (مطلوب إتلافه)
            </span>
          </div>
          <p className="mt-1.5 text-base sm:text-lg font-black font-mono text-rose-700 dark:text-rose-300 print:text-black">
            {health.expiredStockUnits.toLocaleString()} عبوة
          </p>
        </Card>
      </div>

      {/* Low Stock Items Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300 print:shadow-none">
        <CardHeader className="pb-3 border-b-2 border-slate-200 dark:border-[#1E293B] print:border-slate-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 print:hidden" />
            <CardTitle className="text-sm font-black text-slate-900 dark:text-white print:text-black">
              جدول قائمة الأصناف والأدوية الواجب إعادة طلبها وتوريدها
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-100 dark:bg-[#0B0F17]/70 print:bg-slate-200 border-b-2 border-slate-300 text-slate-800 font-black uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">اسم الصنف الدوائي</th>
                  <th className="py-3 px-4 text-start">التصنيف الدوائي</th>
                  <th className="py-3 px-4 text-center">الرصيد المتبقي</th>
                  <th className="py-3 px-4 text-center">حد الطلب الأدنى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B] print:divide-slate-300 font-mono">
                {lowStockItems.map((item, idx) => (
                  <tr
                    key={item.productId}
                    className={`hover:bg-slate-50/70 ${
                      idx % 2 === 1 ? 'bg-slate-50/50 print:bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white print:text-black">
                      <span className="block">{item.productName}</span>
                      <span className="font-mono text-[10px] text-slate-500 font-normal">
                        {item.barcode || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300 print:text-black">
                      {item.categoryName}
                    </td>
                    <td className="py-3 px-4 font-black text-rose-600 dark:text-rose-400 print:text-black text-center">
                      {item.currentStock} عبوة
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 print:text-black text-center">
                      {item.minimumStock} عبوة
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
