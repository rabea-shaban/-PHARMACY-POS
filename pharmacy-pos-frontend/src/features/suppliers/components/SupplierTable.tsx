import React from 'react';
import { useTranslation } from 'react-i18next';
import { Supplier } from '../types/supplier.types.js';
import { SupplierStatusBadge } from './SupplierStatusBadge.js';
import { Button } from '../../../components/ui/Button.js';
import { Eye, Edit3, Trash2, Truck, ChevronLeft, ChevronRight, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { EmptyState } from '../../../components/common/EmptyState.js';

export interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onDelete?: (supplier: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  isLoading,
  pagination,
  onPageChange,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);
  const { direction } = useAppSelector((state) => state.ui);

  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);
  const canDelete = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-12 shadow-xs">
        <EmptyState
          icon={Truck}
          title={t('suppliers.noSuppliersFound')}
          description={t('suppliers.noSuppliersFoundDesc')}
          action={
            canEdit ? (
              <Link to="/suppliers/new">
                <Button variant="primary" size="sm">
                  {t('suppliers.addSupplier')}
                </Button>
              </Link>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3.5 px-4 text-start">{t('suppliers.colSupplier')}</th>
              <th className="py-3.5 px-4 text-start">{t('suppliers.colPhone')}</th>
              <th className="py-3.5 px-4 text-start">{t('suppliers.colEmail')}</th>
              <th className="py-3.5 px-4 text-start">{t('suppliers.colAddress')}</th>
              <th className="py-3.5 px-4 text-start">{t('suppliers.colPurchasesCount')}</th>
              <th className="py-3.5 px-4 text-start">{t('common.status')}</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {suppliers.map((supplier: Supplier) => (
              <tr
                key={supplier.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Supplier Name */}
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {supplier.name}
                  {supplier.taxNumber && (
                    <span className="block text-[11px] font-normal text-slate-400">
                      {t('suppliers.fieldTaxNumber')}: {supplier.taxNumber}
                    </span>
                  )}
                </td>

                {/* Phone */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{supplier.phone}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {supplier.email ? (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-xs">{supplier.email}</span>
                    </div>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Address */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                  {supplier.address || '—'}
                </td>

                {/* Purchases Count */}
                <td className="py-3.5 px-4 font-black text-sky-600 dark:text-sky-400">
                  {supplier._count?.purchases ?? 0} {t('dashboard.ordersUnit')}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <SupplierStatusBadge isActive={supplier.isActive} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <Link
                      to={`/suppliers/${supplier.id}`}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-[#1E293B] transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    {canEdit && (
                      <Link
                        to={`/suppliers/${supplier.id}/edit`}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[#1E293B] transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    )}

                    {/* Delete / Deactivate */}
                    {canDelete && onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(supplier)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
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
