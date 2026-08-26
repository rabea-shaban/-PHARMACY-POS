import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEmployeePayrolls } from '../../payroll/hooks/usePayroll.js';
import { PayrollStatusBadge } from '../../payroll/components/PayrollStatusBadge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Coins, Printer, Eye, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface UserPayrollHistoryProps {
  userId: string;
  userName: string;
}

export const UserPayrollHistory: React.FC<UserPayrollHistoryProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { data: payrolls = [], isLoading } = useEmployeePayrolls(userId);

  // Calculate Aggregates
  const totalBase = payrolls.reduce((acc, p) => acc + (p.baseSalary || 0), 0);
  const totalCommission = payrolls.reduce((acc, p) => acc + (p.commission || 0), 0);
  const totalBonus = payrolls.reduce((acc, p) => acc + (p.bonus || 0), 0);
  const totalDeductions = payrolls.reduce((acc, p) => acc + (p.deductions || 0), 0);
  const totalNet = payrolls.reduce((acc, p) => acc + (p.netSalary || 0), 0);
  const paidCount = payrolls.filter((p) => p.status === 'PAID').length;

  return (
    <div className="space-y-4">
      {/* Financial Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/30">
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            إجمالي صافي الرواتب المستحقة
          </span>
          <p className="mt-1 text-base font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(totalNet)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            أساسي تراكمي: {formatCurrency(totalBase)} ({paidCount} من {payrolls.length} مصروف)
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
            إجمالي العمولات المكتسبة
          </span>
          <p className="mt-1 text-base font-black text-sky-600 dark:text-sky-400 font-mono">
            +{formatCurrency(totalCommission)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            عمولات حوافز المبيعات
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            إجمالي المكافآت
          </span>
          <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4" />
            +{formatCurrency(totalBonus)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            مكافآت وحوافز إضافية
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-200/50 dark:border-rose-900/30">
          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
            إجمالي الاستقطاعات
          </span>
          <p className="mt-1 text-base font-black text-rose-600 dark:text-rose-400 font-mono flex items-center gap-0.5">
            <ArrowDownRight className="w-4 h-4" />
            -{formatCurrency(totalDeductions)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            خصومات وغيابات
          </p>
        </Card>
      </div>

      {/* Historical Payroll Ledger Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-sky-600" />
            <CardTitle className="text-sm">سجل مسيرات الرواتب منذ بداية العمل</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : payrolls.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={Coins}
                title="لا توجد مسيرات رواتب سابقة"
                description="لم يتم إنشاء أو توليد أي مسيرات رواتب لهذا الموظف حتى الآن."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4 text-start">فترة المسير</th>
                    <th className="py-3 px-4 text-start">الراتب الأساسي</th>
                    <th className="py-3 px-4 text-start">العمولات</th>
                    <th className="py-3 px-4 text-start">مكافآت / استقطاعات</th>
                    <th className="py-3 px-4 text-start font-black text-slate-900 dark:text-white">الصافي</th>
                    <th className="py-3 px-4 text-start">الحالة</th>
                    <th className="py-3 px-4 text-end">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                  {payrolls.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {formatDate(p.periodStart)} إلى {formatDate(p.periodEnd)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(p.baseSalary)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        +{formatCurrency(p.commission)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-emerald-600 font-bold">+{formatCurrency(p.bonus)}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-rose-500 font-bold">-{formatCurrency(p.deductions)}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-slate-900 dark:text-white">
                        {formatCurrency(p.netSalary)} {t('common.currency')}
                      </td>
                      <td className="py-3 px-4">
                        <PayrollStatusBadge status={p.status} />
                      </td>
                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/payroll/${p.id}`}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                            title={t('common.view')}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/payroll/${p.id}/slip`}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-indigo-50 dark:hover:bg-[#1E293B] text-indigo-600 dark:text-indigo-400 transition-colors"
                            title="طباعة قسيمة الراتب"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
