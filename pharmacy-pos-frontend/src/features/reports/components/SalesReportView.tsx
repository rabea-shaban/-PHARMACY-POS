import React from 'react';
import { useTranslation } from 'react-i18next';
import { SalesReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { TrendingUp, Receipt, RotateCcw, ShoppingBag, CreditCard, Award } from 'lucide-react';

export interface SalesReportViewProps {
  data: SalesReportResponse;
  isLoading: boolean;
}

export const SalesReportView: React.FC<SalesReportViewProps> = ({ data, isLoading }) => {
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

  const { summary, paymentMethodBreakdown, topSellingProducts, topSellingCategories } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">إجمالي المبيعات (Gross)</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.totalGrossSales)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            عدد {summary.invoiceCount} فاتورة بيع
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">صافي المبيعات (Net Sales)</span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(summary.netSales)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            بعد خصم المرتجعات
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">قيمة المرتجعات</span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            -{formatCurrency(summary.returnedAmount)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-bold">
            مبالغ مستردة للعملاء
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">متوسط قيمة الفاتورة</span>
            <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.averageInvoiceValue)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            إجمالي {summary.totalItemsSold} صنف مباع
          </p>
        </Card>
      </div>

      {/* Payment Methods & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Methods Breakdown */}
        <Card className="rounded-3xl shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <CardTitle className="text-sm">توزيع طرق الدفع والتحصيل</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {paymentMethodBreakdown.map((pm) => (
              <div key={pm.paymentMethod} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{pm.paymentMethod}</span>
                  <span className="text-[10px] text-slate-400">({pm.count} حركة)</span>
                </div>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  {formatCurrency(pm.amount)} {t('common.currency')}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="rounded-3xl shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm">أعلى التصنيفات الدوائية مبيعاً</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {topSellingCategories.slice(0, 5).map((cat) => (
              <div key={cat.categoryId} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17]">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{cat.categoryName}</span>
                  <span className="text-[10px] text-slate-400">مباع: {cat.quantitySold} عبوة</span>
                </div>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(cat.revenue)} {t('common.currency')}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm">الأدوية والأصناف الأكثر مبيعاً وتحقيقاً للإيراد</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">اسم الصنف الدوائي</th>
                  <th className="py-3 px-4 text-start">الباركود</th>
                  <th className="py-3 px-4 text-end">الكمية المباعة</th>
                  <th className="py-3 px-4 text-end">الإيراد المحقق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {topSellingProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.productName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.barcode || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 text-end">
                      {p.quantitySold} عبوة
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-end">
                      {formatCurrency(p.revenue)} {t('common.currency')}
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
