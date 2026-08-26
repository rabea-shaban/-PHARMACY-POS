import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/product.types.js';
import { ProductStatusBadge } from './ProductStatusBadge.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Button } from '../../../components/ui/Button.js';
import { Eye, Edit3, Trash2, Pill, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { EmptyState } from '../../../components/common/EmptyState.js';

export interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onDelete?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
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
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-12 shadow-xs">
        <EmptyState
          icon={Pill}
          title={t('products.noProductsFound')}
          description={t('products.noProductsFoundDesc')}
          action={
            canEdit ? (
              <Link to="/products/new">
                <Button variant="primary" size="sm">
                  {t('products.addProduct')}
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
              <th className="py-3.5 px-4 text-start">{t('products.colProduct')}</th>
              <th className="py-3.5 px-4 text-start">{t('products.colBarcode')}</th>
              <th className="py-3.5 px-4 text-start">{t('products.colCategory')}</th>
              <th className="py-3.5 px-4 text-start">{t('products.colSellingPrice')}</th>
              <th className="py-3.5 px-4 text-start">{t('products.colStock')}</th>
              <th className="py-3.5 px-4 text-start">{t('products.colStatus')}</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Product Name & Scientific */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {product.name}
                  </div>
                  {product.scientificName && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                      {product.scientificName}
                    </div>
                  )}
                </td>

                {/* Barcode */}
                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                  {product.barcode || <span className="text-slate-400 dark:text-slate-600 text-[11px]">—</span>}
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-[11px] font-medium">
                    {product.category?.name || '—'}
                  </span>
                </td>

                {/* Selling Price */}
                <td className="py-3.5 px-4 font-black text-sky-600 dark:text-sky-400">
                  {formatCurrency(product.sellingPrice)}
                </td>

                {/* Current Stock */}
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  <span>{product.currentStock}</span>
                  <span className="text-[10px] text-slate-400 ms-1">({t('dashboard.minThreshold')}: {product.minimumStock})</span>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <ProductStatusBadge
                    currentStock={product.currentStock}
                    minimumStock={product.minimumStock}
                    isActive={product.isActive}
                  />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <Link
                      to={`/products/${product.id}`}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-[#1E293B] transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    {canEdit && (
                      <Link
                        to={`/products/${product.id}/edit`}
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
                        onClick={() => onDelete(product)}
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('common.showing')} {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white dark:hover:bg-[#131B2A] transition-colors cursor-pointer"
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
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white dark:hover:bg-[#131B2A] transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
