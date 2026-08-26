import React from 'react';
import { useTranslation } from 'react-i18next';
import { PurchaseReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Truck, CheckCircle2, Clock, Building2 } from 'lucide-react';

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

  const { summary, supplierSpendingBreakdown } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">إجمالي المشتريات والتوريد</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.totalPurchaseValue)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            عدد {summary.totalInvoices} فاتورة توريد
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">المسدد للموردين</span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(summary.totalAmountPaid)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            مدفوعات مؤكدة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">مستحقات آجلة للموردين</span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {formatCurrency(summary.totalAmountRemaining)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
            بانتظار السداد
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">حالات الفواتير</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
            <p className="text-emerald-600 font-bold">مستلمة: {summary.receivedInvoices}</p>
            <p className="text-amber-600 font-bold">معلقة: {summary.pendingInvoices}</p>
          </div>
        </Card>
      </div>

      {/* Supplier Spend Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            <CardTitle className="text-sm">توزيع حجم المشتريات والإنفاق على الموردين</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">اسم شركة التوريد / المورد</th>
                  <th className="py-3 px-4 text-start">رقم الهاتف</th>
                  <th className="py-3 px-4 text-end">عدد الفواتير</th>
                  <th className="py-3 px-4 text-end">إجمالي المنصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {supplierSpendingBreakdown.map((s) => (
                  <tr key={s.supplierId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{s.supplierName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.supplierPhone || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-end">
                      {s.invoiceCount} فاتورة
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400 text-end">
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
