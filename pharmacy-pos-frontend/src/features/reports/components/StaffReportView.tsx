import React from 'react';
import { useTranslation } from 'react-i18next';
import { StaffReportResponse } from '../types/report.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Users, TrendingUp, Award, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StaffReportViewProps {
  data: StaffReportResponse;
  isLoading: boolean;
}

export const StaffReportView: React.FC<StaffReportViewProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, staffPerformance } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">طاقم العمل المقيّم</span>
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {summary.totalStaffEvaluated} صيدلي وموظف
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            نشطون في المبيعات
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300">إجمالي المبيعات المنجزة</span>
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(summary.totalSalesHandled)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-bold">
            حجم المبيعات المحققة
          </p>
        </Card>

        <Card className="p-4 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">إجمالي العمولات الموزعة</span>
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            +{formatCurrency(summary.totalCommissionDistributed)} {t('common.currency')}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
            حوافز أداء الصيادلة
          </p>
        </Card>
      </div>

      {/* Staff Performance Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-600" />
            <CardTitle className="text-sm">تفاصيل أداء المبيعات والعمولات لكل موظف</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">الموظف</th>
                  <th className="py-3 px-4 text-start">الدور الوظيفي</th>
                  <th className="py-3 px-4 text-end">عدد الفواتير</th>
                  <th className="py-3 px-4 text-end">إجمالي المبيعات</th>
                  <th className="py-3 px-4 text-end">العمولات المكتسبة</th>
                  <th className="py-3 px-4 text-end">المرتجعات</th>
                  <th className="py-3 px-4 text-end font-black text-slate-900 dark:text-white">صافي العمولة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {staffPerformance.map((staff) => (
                  <tr key={staff.userId} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <Link
                        to={`/users/${staff.userId}`}
                        className="flex items-center gap-1.5 hover:text-sky-600"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{staff.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">{staff.role}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-end">
                      {staff.invoicesCount} فاتورة
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-slate-900 dark:text-white text-end">
                      {formatCurrency(staff.totalSalesAmount)} {t('common.currency')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 text-end">
                      +{formatCurrency(staff.commissionEarned)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-500 text-end">
                      -{formatCurrency(staff.commissionReversed)}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 text-end bg-emerald-50/40 dark:bg-emerald-950/20">
                      +{formatCurrency(staff.netCommission)} {t('common.currency')}
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
