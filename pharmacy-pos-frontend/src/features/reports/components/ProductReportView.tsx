import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductReportResponse } from '../types/report.types.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Pill, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export interface ProductReportViewProps {
  data: ProductReportResponse;
  isLoading: boolean;
}

export const ProductReportView: React.FC<ProductReportViewProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">الأصناف التي تم تقييمها</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {summary.totalProductsEvaluated.toLocaleString()} دواء
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            إجمالي {summary.totalUnitsSold} عبوة مباعة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">إجمالي الإيراد المحقق</span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(summary.totalRevenueGenerated)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            من مبيعات المنتجات
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">أصناف بطيئة الحركة</span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {summary.slowMovingCount} صنف
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
            مبيعات أقل من عبوتين في الفترة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">أصناف راكدة (صفر مبيعات)</span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {summary.zeroSalesCount} صنف
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-bold">
            لم تسجل أي حركة بيع
          </p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E293B] pb-2">
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

      {/* Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">الصنف الدوائي</th>
                  <th className="py-3 px-4 text-start">التصنيف</th>
                  <th className="py-3 px-4 text-end">سعر البيع</th>
                  <th className="py-3 px-4 text-end">المخزون الحالي</th>
                  <th className="py-3 px-4 text-end">الكمية المباعة</th>
                  <th className="py-3 px-4 text-end">صافي الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {displayList.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{item.barcode || '—'}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">{item.categoryName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 text-end">
                      {formatCurrency(item.sellingPrice)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-end">
                      {item.currentStock} عبوة
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 text-end">
                      {item.netQuantity}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-end">
                      {formatCurrency(item.netRevenue)} {t('common.currency')}
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
