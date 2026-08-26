import React from 'react';
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-slate-900">
              إجمالي قاعدة العملاء
            </span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 print:hidden">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {summary.totalCustomers.toLocaleString()} عميل
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            {summary.activeCustomers} عميل نشط
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 print:text-slate-900">
              عملاء قاموا بالشراء
            </span>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 print:hidden">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 print:text-black font-mono">
            {summary.purchasingCustomersInPeriod.toLocaleString()} عميل
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 print:text-slate-600 mt-1 font-bold">
            خلال الفترة المحددة
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 print:text-slate-900">
              متوسط إنفاق العميل
            </span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 print:hidden">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black font-mono">
            {formatCurrency(summary.averageCustomerSpend)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-bold">
            متوسط المشتريات للعميل
          </p>
        </Card>

        <Card className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 print:text-slate-900">
              نقاط الولاء المكتسبة
            </span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 print:hidden">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 print:text-black font-mono">
            {loyaltySummary.totalPointsEarned.toLocaleString()} نقطة
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 print:text-slate-600 mt-1 font-bold">
            تم استبدال {loyaltySummary.totalPointsRedeemed} نقطة
          </p>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden print:border-slate-300 print:shadow-none">
        <CardHeader className="pb-3 border-b-2 border-slate-200 dark:border-[#1E293B] print:border-slate-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 print:hidden" />
            <CardTitle className="text-sm font-black text-slate-900 dark:text-white print:text-black">
              جدول أعلى العملاء شراءً وتحقيقاً للمبيعات
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-100 dark:bg-[#0B0F17]/70 print:bg-slate-200 border-b-2 border-slate-300 text-slate-800 font-black uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">العميل</th>
                  <th className="py-3 px-4 text-start">رقم الهاتف</th>
                  <th className="py-3 px-4 text-start">شريحة الولاء</th>
                  <th className="py-3 px-4 text-center">عدد الفواتير</th>
                  <th className="py-3 px-4 text-center">نقاط الولاء الحالية</th>
                  <th className="py-3 px-4 text-end">إجمالي الإنفاق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B] print:divide-slate-300 font-mono">
                {topCustomersByRevenue.map((c, idx) => (
                  <tr
                    key={c.customerId}
                    className={`hover:bg-slate-50/70 ${
                      idx % 2 === 1 ? 'bg-slate-50/50 print:bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white print:text-black">
                      <Link
                        to={`/customers/${c.customerId}`}
                        className="hover:text-sky-600 print:pointer-events-none"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.phone || '—'}</td>
                    <td className="py-3 px-4 font-sans font-bold text-purple-700 dark:text-purple-400 print:text-black">
                      {c.tierName}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 print:text-black text-center">
                      {c.invoicesCount} فاتورة
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400 print:text-black text-center">
                      {c.currentLoyaltyPoints} نقطة
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-700 dark:text-emerald-400 print:text-black text-end">
                      {formatCurrency(c.totalSpend)}
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
