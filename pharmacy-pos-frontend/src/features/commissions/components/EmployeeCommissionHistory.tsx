import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStaffCommissionTransactions } from '../hooks/useCommissions.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Award, Printer, Eye, Receipt } from 'lucide-react';

export interface EmployeeCommissionHistoryProps {
  userId: string;
  userName: string;
  userRole?: string;
}

export const EmployeeCommissionHistory: React.FC<EmployeeCommissionHistoryProps> = ({
  userId,
}) => {
  const { t } = useTranslation();
  const { data: txData, isLoading } = useStaffCommissionTransactions(userId, { limit: 100 });
  const transactions = txData?.items || [];

  const totalSales = transactions.reduce((acc, tx) => acc + (tx.salesAmount || 0), 0);
  const totalCommission = transactions.reduce((acc, tx) => acc + (tx.commissionAmount || 0), 0);
  const avgRate = transactions.length > 0
    ? transactions.reduce((acc, tx) => acc + tx.commissionRate, 0) / transactions.length
    : 0;

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
            إجمالي العمولات المكتسبة
          </span>
          <p className="mt-1 text-base font-black text-slate-900 dark:text-white font-mono">
            +{formatCurrency(totalCommission)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            عدد {transactions.length} حركة عمولة
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
            إجمالي مبيعات العمولات
          </span>
          <p className="mt-1 text-base font-black text-sky-600 dark:text-sky-400 font-mono">
            {formatCurrency(totalSales)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            قيمة المبيعات المحققة
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
              متوسط نسبة العمولة
            </span>
            <Link
              to={`/commissions/statement/${userId}`}
              className="p-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
              title="طباعة كشف العمولات"
            >
              <Printer className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="mt-1 text-base font-black text-purple-600 dark:text-purple-400 font-mono">
            {avgRate.toFixed(2)}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            متوسط النسبة على الفواتير
          </p>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm">سجل عمليات العمولات المكتسبة للصيدلي</CardTitle>
            </div>

            <Link
              to={`/commissions/statement/${userId}`}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة كشف العمولات</span>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={Award}
                title="لا توجد عمولات مسجلة"
                description="لم يتم احتساب أي عمولات بيعية لهذا الموظف حتى الآن."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4 text-start">رقم الفاتورة</th>
                    <th className="py-3 px-4 text-start">قاعدة العمولة</th>
                    <th className="py-3 px-4 text-start">قيمة المبيعات</th>
                    <th className="py-3 px-4 text-start">نسبة العمولة</th>
                    <th className="py-3 px-4 text-start font-black text-slate-900 dark:text-white">مبلغ العمولة</th>
                    <th className="py-3 px-4 text-start">تاريخ الحركة</th>
                    <th className="py-3 px-4 text-end">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {tx.invoiceNumber ? (
                          <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                            <Receipt className="w-3.5 h-3.5" />
                            <span>#{tx.invoiceNumber}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                        {tx.commissionRuleName || 'النسبة الافتراضية'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(tx.salesAmount)} {t('common.currency')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                        {tx.commissionRate}%
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(tx.commissionAmount)} {t('common.currency')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-end">
                        {tx.saleId && (
                          <Link
                            to={`/sales/${tx.saleId}`}
                            className="p-1.5 inline-flex rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                            title="عرض تفاصيل الفاتورة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
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
