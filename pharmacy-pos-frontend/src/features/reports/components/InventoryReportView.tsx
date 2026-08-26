import React from 'react';
import { useTranslation } from 'react-i18next';
import { InventoryReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Boxes, ShieldAlert, CheckCircle2, Clock, AlertOctagon, TrendingUp } from 'lucide-react';

export interface InventoryReportViewProps {
  data: InventoryReportResponse;
  isLoading: boolean;
}

export const InventoryReportView: React.FC<InventoryReportViewProps> = ({ data, isLoading }) => {
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

  const { summary, health, lowStockItems } = data;

  return (
    <div className="space-y-6">
      {/* Valuation & Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">القيمة التقديرية بسعر التكلفة</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.derivableInventoryCostValue)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            تكلفة البضاعة في المخزن
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">القيمة التقديرية بسعر البيع</span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(summary.derivableInventoryRetailValue)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            إجمالي العائد المتوقع عند البيع
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">إجمالي الوحدات والعبوات</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {summary.totalStockUnits.toLocaleString()} عبوة
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            في {summary.totalActiveBatches} تشغيلة فعالة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">أصناف قاربت على النفاد</span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {health.lowStockProductsCount} صنف
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-bold">
            أقل من حد الطلب الأدنى
          </p>
        </Card>
      </div>

      {/* Stock Health Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">مخزون سليم وفعال</span>
          </div>
          <p className="mt-2 text-lg font-black font-mono text-emerald-700 dark:text-emerald-300">
            {health.healthyStockUnits.toLocaleString()} عبوة
          </p>
        </Card>

        <Card className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-xs text-amber-900 dark:text-amber-200">ينتهي خلال 90 يوماً</span>
          </div>
          <p className="mt-2 text-lg font-black font-mono text-amber-700 dark:text-amber-300">
            {health.expiringSoonStockUnits.toLocaleString()} عبوة
          </p>
        </Card>

        <Card className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span className="font-bold text-xs text-rose-900 dark:text-rose-200">منتهي الصلاحية</span>
          </div>
          <p className="mt-2 text-lg font-black font-mono text-rose-700 dark:text-rose-300">
            {health.expiredStockUnits.toLocaleString()} عبوة
          </p>
        </Card>
      </div>

      {/* Low Stock Items Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <CardTitle className="text-sm">قائمة الأصناف الواجب إعادة طلبها وتوريدها</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">الصنف</th>
                  <th className="py-3 px-4 text-start">التصنيف</th>
                  <th className="py-3 px-4 text-end">الرصيد المتبقي</th>
                  <th className="py-3 px-4 text-end">حد الطلب الأدنى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {lowStockItems.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.productName}</td>
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">{item.categoryName}</td>
                    <td className="py-3 px-4 font-mono font-black text-rose-600 dark:text-rose-400 text-end">
                      {item.currentStock} عبوة
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-end">
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
