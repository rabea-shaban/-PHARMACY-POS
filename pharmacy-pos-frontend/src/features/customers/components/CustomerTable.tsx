import React from 'react';
import { useTranslation } from 'react-i18next';
import { Customer } from '../types/customer.types.js';
import { CustomerTierBadge } from './CustomerTierBadge.js';
import { Badge } from '../../../components/ui/Badge.js';
import { formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Eye, Edit, ChevronLeft, ChevronRight, Phone, Sparkles } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  pagination,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3.5 px-4 text-start">العميل</th>
              <th className="py-3.5 px-4 text-start">رقم الهاتف</th>
              <th className="py-3.5 px-4 text-start">فئة الولاء</th>
              <th className="py-3.5 px-4 text-start">رصيد النقاط</th>
              <th className="py-3.5 px-4 text-start">الحالة</th>
              <th className="py-3.5 px-4 text-start">تاريخ التسجيل</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {customers.map((c: Customer) => (
              <tr
                key={c.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Name & Email */}
                <td className="py-3.5 px-4">
                  <Link
                    to={`/customers/${c.id}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors block"
                  >
                    {c.name}
                  </Link>
                  {c.email && (
                    <span className="text-[11px] text-slate-400 block">{c.email}</span>
                  )}
                </td>

                {/* Phone */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                </td>

                {/* Tier */}
                <td className="py-3.5 px-4">
                  <CustomerTierBadge tier={c.tier} />
                </td>

                {/* Points */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{c.loyaltyAccount?.totalPoints || 0} نقطة</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  {c.isActive ? (
                    <Badge variant="success">نشط</Badge>
                  ) : (
                    <Badge variant="neutral">معطل</Badge>
                  )}
                </td>

                {/* Registration Date */}
                <td className="py-3.5 px-4 text-slate-500">
                  {formatDate(c.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/customers/${c.id}`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {canEdit && (
                      <Link
                        to={`/customers/${c.id}/edit`}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
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
              onClick={() => onPageChange(pagination.page - 1)}
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
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
