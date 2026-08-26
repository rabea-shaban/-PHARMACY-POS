import React from 'react';
import { useTranslation } from 'react-i18next';
import { SalesReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import {
  TrendingUp,
  Receipt,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  Award,
  Calendar,
} from 'lucide-react';

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

  const {
    summary,
    paymentMethodBreakdown,
    topSellingProducts,
    topSellingCategories,
    invoices,
    dailyTrend,
  } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 print:text-slate-900">
              إجمالي المبيعات (Gross)
            </span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 print:hidden">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {formatCurrency(summary.totalGrossSales)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            عدد {summary.invoiceCount} فاتورة بيع
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 print:text-slate-900">
              صافي المبيعات (Net Sales)
            </span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 print:hidden">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 print:text-black font-mono">
            {formatCurrency(summary.netSales)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 print:text-slate-600 mt-1 font-bold">
            بعد خصم المرتجعات
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 print:text-slate-900">
              قيمة المرتجعات
            </span>
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 print:hidden">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-600 dark:text-rose-400 print:text-black font-mono">
            -{formatCurrency(summary.returnedAmount)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-bold">
            مبالغ مستردة للعملاء
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 print:text-slate-900">
              متوسط قيمة الفاتورة
            </span>
            <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 print:hidden">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {formatCurrency(summary.averageInvoiceValue)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            إجمالي {summary.totalItemsSold} صنف مباع
          </p>
        </Card>
      </div>

      {/* Payment Methods & Top Categories Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Methods Breakdown Table */}
        <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-600 print:hidden" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                جدول توزيع طرق الدفع والتحصيل
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4 text-start">طريقة الدفع</th>
                  <th className="py-2.5 px-4 text-center">عدد العمليات</th>
                  <th className="py-2.5 px-4 text-end">إجمالي المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200">
                {paymentMethodBreakdown.map((pm) => (
                  <tr key={pm.paymentMethod} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {pm.paymentMethod}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-center text-slate-600">
                      {pm.count} عملية
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-end text-slate-900 dark:text-white print:text-black">
                      {formatCurrency(pm.amount)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Top Categories Table */}
        <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 print:hidden" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                أعلى التصنيفات الدوائية تحقيقاً للمبيعات
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4 text-start">التصنيف الدوائي</th>
                  <th className="py-2.5 px-4 text-center">الكمية المباعة</th>
                  <th className="py-2.5 px-4 text-end">الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200">
                {topSellingCategories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {cat.categoryName}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-center text-slate-600">
                      {cat.quantitySold} عبوة
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-end text-emerald-600 dark:text-emerald-400 print:text-black">
                      {formatCurrency(cat.revenue)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Daily Sales Ledger Table */}
      {dailyTrend && dailyTrend.length > 0 && (
        <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600 print:hidden" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                جدول حركة المبيعات اليومية خلال الفترة
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4 text-start">التاريخ</th>
                  <th className="py-2.5 px-4 text-center">عدد فواتير البيع</th>
                  <th className="py-2.5 px-4 text-end">إجمالي قيمة المبيعات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200 font-mono">
                {dailyTrend.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {formatDate(d.date)}
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600">
                      {d.salesCount} فاتورة
                    </td>
                    <td className="py-2.5 px-4 font-bold text-end text-slate-900 dark:text-white print:text-black">
                      {formatCurrency(d.grossAmount)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Top Products Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 print:hidden" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
              الأدوية والأصناف الأكثر مبيعاً وتحقيقاً للإيراد
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">اسم الصنف الدوائي</th>
                  <th className="py-3 px-4 text-start">الباركود</th>
                  <th className="py-3 px-4 text-end">الكمية المباعة</th>
                  <th className="py-3 px-4 text-end">الإيراد المحقق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200">
                {topSellingProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {p.productName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.barcode || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black text-end">
                      {p.quantitySold} عبوة
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 print:text-black text-end">
                      {formatCurrency(p.revenue)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List Table */}
      {invoices && invoices.length > 0 && (
        <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-600 print:hidden" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                سجل فواتير المبيعات الصادرة خلال الفترة
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4 text-start">رقم الفاتورة</th>
                    <th className="py-3 px-4 text-start">التاريخ</th>
                    <th className="py-3 px-4 text-start">الكاشير / الصيدلي</th>
                    <th className="py-3 px-4 text-start">العميل</th>
                    <th className="py-3 px-4 text-center">عدد الأصناف</th>
                    <th className="py-3 px-4 text-end">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200 font-mono">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-sky-600 print:text-black">
                        #{inv.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{formatDate(inv.date)}</td>
                      <td className="py-2.5 px-4 font-sans font-bold text-slate-800 dark:text-slate-200 print:text-black">
                        {inv.cashierName}
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-600">
                        {inv.customerName || 'عميل نقدي'}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600">
                        {inv.itemsCount}
                      </td>
                      <td className="py-2.5 px-4 font-black text-slate-900 dark:text-white print:text-black text-end">
                        {formatCurrency(inv.total)} {t('common.currency')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
