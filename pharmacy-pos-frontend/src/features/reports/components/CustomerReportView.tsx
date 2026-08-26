import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Users, Award, ShoppingBag, UserCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CustomerReportViewProps {
  data: CustomerReportResponse;
  isLoading: boolean;
}

export const CustomerReportView: React.FC<CustomerReportViewProps> = ({ data, isLoading }) => {
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

  const { summary, loyaltySummary, topCustomersByRevenue } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">إجمالي قاعدة العملاء</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {summary.totalCustomers.toLocaleString()} عميل
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            {summary.activeCustomers} عميل نشط
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">عملاء قاموا بالشراء</span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {summary.purchasingCustomersInPeriod.toLocaleString()} عميل
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            خلال الفترة المحددة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">متوسط إنفاق العميل</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.averageCustomerSpend)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            متوسط المشتريات للعميل
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">نقاط الولاء المكتسبة</span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {loyaltySummary.totalPointsEarned.toLocaleString()} نقطة
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
            تم استبدال {loyaltySummary.totalPointsRedeemed} نقطة
          </p>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm">أعلى العملاء شراءً وتحقيقاً للمبيعات</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">العميل</th>
                  <th className="py-3 px-4 text-start">رقم الهاتف</th>
                  <th className="py-3 px-4 text-start">شريحة الولاء</th>
                  <th className="py-3 px-4 text-end">عدد الفواتير</th>
                  <th className="py-3 px-4 text-end">نقاط الولاء الحالية</th>
                  <th className="py-3 px-4 text-end">إجمالي الإنفاق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {topCustomersByRevenue.map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4">
                      <Link
                        to={`/customers/${c.customerId}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-sky-600"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.phone || '—'}</td>
                    <td className="py-3 px-4 font-bold text-purple-600 dark:text-purple-400">{c.tierName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-end">
                      {c.invoicesCount} فاتورة
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 text-end">
                      {c.currentLoyaltyPoints} نقطة
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-end">
                      {formatCurrency(c.totalSpend)} {t('common.currency')}
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
