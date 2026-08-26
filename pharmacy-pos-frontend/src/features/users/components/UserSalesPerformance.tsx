import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSales } from '../../sales/hooks/useSales.js';
import { SaleStatus } from '../../sales/types/sale.types.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { ShoppingBag, Receipt, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface UserSalesPerformanceProps {
  userId: string;
  userName: string;
}

export const UserSalesPerformance: React.FC<UserSalesPerformanceProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const [page, setPage] = useState(1);

  const { data: salesData, isLoading } = useSales({
    userId,
    page,
    limit: 10,
  });

  const sales = salesData?.items || [];
  const pagination = salesData?.pagination;

  // Compute Statistics
  const totalSalesCount = pagination?.total || sales.length;
  const totalAmountHandled = sales.reduce((acc, s) => acc + (s.total || 0), 0);
  const totalCommission = sales.reduce((acc, s) => acc + (s.commissionEarned || 0), 0);
  const avgTicket = totalSalesCount > 0 && sales.length > 0 ? totalAmountHandled / sales.length : 0;

  const getStatusBadge = (st: SaleStatus) => {
    switch (st) {
      case 'COMPLETED':
        return <Badge variant="success">مكتملة</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">مسودة</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">ملغاة</Badge>;
      case 'PARTIALLY_RETURNED':
        return <Badge variant="purple">مرتجع جزئي</Badge>;
      case 'RETURNED':
        return <Badge variant="coral">مرتجع كامل</Badge>;
      default:
        return <Badge variant="neutral">{st}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-sky-500/10 to-sky-500/5 border-sky-200/50 dark:border-sky-900/30">
          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
            إجمالي عدد فواتير البيع
          </span>
          <p className="mt-1 text-base font-black text-slate-900 dark:text-white font-mono">
            {totalSalesCount.toLocaleString()} فاتورة
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            العمليات المنجزة بواسطة الموظف
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/30">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            إجمالي حجم المبيعات (باع بكام)
          </span>
          <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(totalAmountHandled)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            إجمالي الإيراد المحقق
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-900/30">
          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
            متوسط قيمة الفاتورة
          </span>
          <p className="mt-1 text-base font-black text-purple-600 dark:text-purple-400 font-mono">
            {formatCurrency(avgTicket)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            معدل السلة لكل عميل (Avg Ticket)
          </p>
        </Card>

        <Card className="p-3.5 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-900/30">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
            عمولات المبيعات المكتسبة
          </span>
          <p className="mt-1 text-base font-black text-amber-600 dark:text-amber-400 font-mono">
            +{formatCurrency(totalCommission)} {t('common.currency')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
            حوافز بيع الأصناف المستهدفة
          </p>
        </Card>
      </div>

      {/* Sales Invoices Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm">سجل فواتير المبيعات الصادرة عن الموظف</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={ShoppingBag}
                title="لا توجد فواتير مبيعات مسجلة"
                description="لم يقم هذا الموظف بإجراء أو تأكيد أي عمليات بيع على الكاشير حتى الآن."
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4 text-start">رقم الفاتورة</th>
                      <th className="py-3 px-4 text-start">التاريخ والوقت</th>
                      <th className="py-3 px-4 text-start">العميل</th>
                      <th className="py-3 px-4 text-start">إجمالي الفاتورة</th>
                      <th className="py-3 px-4 text-start">العمولة</th>
                      <th className="py-3 px-4 text-start">الحالة</th>
                      <th className="py-3 px-4 text-end">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                    {sales.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          #{s.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {formatDate(s.createdAt)}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-200">
                          {s.customerName || 'عميل نقدي مباشر'}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900 dark:text-white">
                          {formatCurrency(s.total)} {t('common.currency')}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                          {s.commissionEarned ? `+${formatCurrency(s.commissionEarned)}` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(s.status)}
                        </td>
                        <td className="py-3 px-4 text-end">
                          <Link
                            to={`/sales/${s.id}`}
                            className="p-1.5 inline-flex rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                            title="عرض تفاصيل الفاتورة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0B0F17]/40">
                  <p className="text-xs text-slate-500">
                    {t('common.showing')} {(pagination.page - 1) * pagination.limit + 1} -{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
                    >
                      {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
                    >
                      {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
