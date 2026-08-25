import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSaleReturns } from '../hooks/useReturns.js';
import { SaleReturn } from '../types/return.types.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { RotateCcw, Plus, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const ReturnsPage: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSaleReturns({
    page,
    limit: 15,
    returnNumber: search || undefined,
  });

  const returns = data?.items || [];
  const pagination = data?.pagination;

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>سجل مرتجعات المبيعات والاسترداد</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة إشعارات الدائن، استرجاع الأدوية للمخزون، وعكس الحركات المالية
          </p>
        </div>

        {canCreate && (
          <Link to="/returns/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              عملية إرجاع جديدة
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
        <div className="flex-1">
          <Input
            placeholder="ابحث برقم إشعار الإرجاع (مثال: RET-1001)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Returns Table */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : returns.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={RotateCcw}
            title="لا توجد عمليات إرجاع مسجلة"
            description="لم يتم تسجيل أي مرتجعات مبيعات حتى الآن."
            action={
              canCreate ? (
                <Link to="/returns/new">
                  <Button variant="primary" size="sm">
                    إرجاع فاتورة بيع
                  </Button>
                </Link>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">رقم إشعار الإرجاع</th>
                  <th className="py-3.5 px-4 text-start">رقم الفاتورة الأصلية</th>
                  <th className="py-3.5 px-4 text-start">التاريخ والوقت</th>
                  <th className="py-3.5 px-4 text-start">العميل</th>
                  <th className="py-3.5 px-4 text-start">المسؤول</th>
                  <th className="py-3.5 px-4 text-start">الأصناف المسترجعة</th>
                  <th className="py-3.5 px-4 text-start">إجمالي المسترد</th>
                  <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {returns.map((ret: SaleReturn) => (
                  <tr
                    key={ret.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                      {ret.returnNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {ret.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(ret.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {ret.customerName || 'عميل نقدي'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {ret.processedByName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {ret.items?.length || 0} صنف
                    </td>
                    <td className="py-3.5 px-4 font-black text-rose-600 dark:text-rose-400 text-sm">
                      {formatCurrency(ret.total)}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <Link
                        to={`/returns/${ret.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-rose-50 dark:hover:bg-[#1E293B] text-rose-600 dark:text-rose-400 font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('common.view')}</span>
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
        </div>
      )}
    </div>
  );
};
