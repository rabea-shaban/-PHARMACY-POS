import React, { useState } from 'react';
import { ProductReportResponse } from '../types/report.types.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Pill, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export interface ProductReportViewProps {
  data: ProductReportResponse;
  isLoading: boolean;
}

export const ProductReportView: React.FC<ProductReportViewProps> = ({ data, isLoading }) => {
  const [filterType, setFilterType] = useState<'all' | 'top' | 'slow' | 'zero'>('all');

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

  const { summary, topSellingProducts, slowMovingProducts, zeroSalesProducts, allProducts } = data;

  const displayList =
    filterType === 'top'
      ? topSellingProducts
      : filterType === 'slow'
      ? slowMovingProducts
      : filterType === 'zero'
      ? zeroSalesProducts
      : allProducts;

  return (
    <div className="space-y-6">
      {/* KPI Cards (Clean Accounting in Print) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-slate-900">
              الأصناف التي تم تقييمها
            </span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 print:hidden">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {summary.totalProductsEvaluated.toLocaleString()} دواء
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            إجمالي {summary.totalUnitsSold} عبوة مباعة
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 print:text-slate-900">
              إجمالي الإيراد المحقق
            </span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 print:hidden">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 print:text-black font-mono">
            {formatCurrency(summary.totalRevenueGenerated)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 print:text-slate-600 mt-1 font-bold">
            من مبيعات المنتجات
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 print:text-slate-900">
              أصناف بطيئة الحركة
            </span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 print:hidden">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 print:text-black font-mono">
            {summary.slowMovingCount} صنف
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 print:text-slate-600 mt-1 font-bold">
            مبيعات أقل من عبوتين في الفترة
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 print:text-slate-900">
              أصناف راكدة (صفر مبيعات)
            </span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 print:hidden">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 print:text-black font-mono">
            {summary.zeroSalesCount} صنف
          </div>
          <p className="text-[11px] text-rose-500 print:text-slate-600 mt-1 font-bold">
            لم تسجل أي حركة بيع
          </p>
        </Card>
      </div>

      {/* Filter Tabs (HIDDEN IN PRINT) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E293B] pb-2 print:hidden">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          كافة الأصناف ({allProducts.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('top')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'top'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          الأكثر مبيعاً ({topSellingProducts.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('slow')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'slow'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          بطيئة الحركة ({slowMovingProducts.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('zero')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'zero'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          الراكدة / صفر مبيعات ({zeroSalesProducts.length})
        </button>
      </div>

      {/* Clean Accounting Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300 print:shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-100 dark:bg-[#0B0F17]/70 print:bg-slate-200 border-b-2 border-slate-300 text-slate-800 font-black uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">الصنف الدوائي</th>
                  <th className="py-3 px-4 text-start">التصنيف الدوائي</th>
                  <th className="py-3 px-4 text-end">سعر البيع</th>
                  <th className="py-3 px-4 text-center">المخزون الحالي</th>
                  <th className="py-3 px-4 text-center">الكمية المباعة</th>
                  <th className="py-3 px-4 text-end">صافي الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B] print:divide-slate-300 font-mono">
                {displayList.map((item, idx) => (
                  <tr
                    key={item.productId}
                    className={`hover:bg-slate-50/70 ${
                      idx % 2 === 1 ? 'bg-slate-50/50 print:bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white print:text-black">
                      <span className="block">{item.name}</span>
                      <span className="font-mono text-[10px] text-slate-500 font-normal">
                        {item.barcode || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-700 dark:text-slate-300 print:text-black">
                      {item.categoryName}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white print:text-black text-end">
                      {formatCurrency(item.sellingPrice)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 print:text-black text-center">
                      {item.currentStock} عبوة
                    </td>
                    <td className="py-3 px-4 font-bold text-sky-700 dark:text-sky-400 print:text-black text-center">
                      {item.netQuantity}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-700 dark:text-emerald-400 print:text-black text-end">
                      {formatCurrency(item.netRevenue)}
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
