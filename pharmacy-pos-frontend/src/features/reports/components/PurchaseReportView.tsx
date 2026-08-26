import React from 'react';
import { useTranslation } from 'react-i18next';
import { PurchaseReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Truck, CheckCircle2, Clock, Building2, Calendar } from 'lucide-react';

export interface PurchaseReportViewProps {
  data: PurchaseReportResponse;
  isLoading: boolean;
}

export const PurchaseReportView: React.FC<PurchaseReportViewProps> = ({ data, isLoading }) => {
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

  const { summary, supplierSpendingBreakdown, monthlyTrend } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-slate-900">
              إجمالي المشتريات والتوريد
            </span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 print:hidden">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {formatCurrency(summary.totalPurchaseValue)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            عدد {summary.totalInvoices} فاتورة توريد
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 print:text-slate-900">
              المسدد للموردين
            </span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 print:hidden">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 print:text-black font-mono">
            {formatCurrency(summary.totalAmountPaid)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 print:text-slate-600 mt-1 font-bold">
            مدفوعات مؤكدة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 print:text-slate-900">
              مستحقات آجلة للموردين
            </span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 print:hidden">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400 print:text-black font-mono">
            {formatCurrency(summary.totalAmountRemaining)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 print:text-slate-600 mt-1 font-bold">
            بانتظار السداد
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30 print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 print:text-slate-900">
              حالات الفواتير
            </span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 print:hidden">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300 print:text-black space-y-1">
            <p className="text-emerald-600 font-bold">مستلمة: {summary.receivedInvoices}</p>
            <p className="text-amber-600 font-bold">معلقة: {summary.pendingInvoices}</p>
          </div>
        </Card>
      </div>

      {/* Monthly Purchases Trend Table */}
      {monthlyTrend && monthlyTrend.length > 0 && (
        <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 print:hidden" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
                جدول حجم التوريد والمشتريات الشهري
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4 text-start">الشهر</th>
                  <th className="py-2.5 px-4 text-center">عدد فواتير التوريد</th>
                  <th className="py-2.5 px-4 text-end">إجمالي قيمة التوريد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200 font-mono">
                {monthlyTrend.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {m.month}
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600">
                      {m.invoiceCount} فاتورة
                    </td>
                    <td className="py-2.5 px-4 font-bold text-end text-indigo-600 dark:text-indigo-400 print:text-black">
                      {formatCurrency(m.totalAmount)} {t('common.currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Supplier Spend Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] print:border-slate-300">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600 print:hidden" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
              جدول توزيع حجم المشتريات والإنفاق على الموردين
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 print:bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">اسم شركة التوريد / المورد</th>
                  <th className="py-3 px-4 text-start">رقم الهاتف</th>
                  <th className="py-3 px-4 text-center">عدد الفواتير</th>
                  <th className="py-3 px-4 text-end">إجمالي المنصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B] print:divide-slate-200">
                {supplierSpendingBreakdown.map((s) => (
                  <tr key={s.supplierId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white print:text-black">
                      {s.supplierName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.supplierPhone || '—'}</td>
                    <td className="py-3 px-4 font-mono text-center text-slate-700 dark:text-slate-300 print:text-black">
                      {s.invoiceCount} فاتورة
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400 print:text-black text-end">
                      {formatCurrency(s.totalSpent)} {t('common.currency')}
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
