import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePurchases } from '../hooks/usePurchases.js';
import { PurchaseStatusBadge } from '../components/PurchaseStatusBadge.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { ShoppingBag, Plus, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { Purchase, PurchaseStatus } from '../types/purchase.types.js';

export const PurchasesPage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);
  const { direction } = useAppSelector((state) => state.ui);

  const [page, setPage] = useState(1);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [status, setStatus] = useState<string>('');

  const { data, isLoading } = usePurchases({
    page,
    limit: 15,
    invoiceNumber: invoiceNumber || undefined,
    status: (status as PurchaseStatus) || undefined,
  });

  const purchases = data?.items || [];
  const pagination = data?.pagination;

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('purchases.pageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('purchases.pageSubtitle')}
          </p>
        </div>

        {canCreate && (
          <Link to="/purchases/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              {t('purchases.createPurchase')}
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
        <div className="flex-1">
          <Input
            placeholder={t('purchases.searchInvoicePlaceholder')}
            value={invoiceNumber}
            onChange={(e) => {
              setInvoiceNumber(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="">{t('purchases.allStatuses')}</option>
            <option value="RECEIVED">{t('purchases.statusReceived')}</option>
            <option value="PENDING">{t('purchases.statusPending')}</option>
            <option value="PAID">{t('purchases.statusPaid')}</option>
            <option value="PARTIALLY_PAID">{t('purchases.statusPartiallyPaid')}</option>
            <option value="CANCELLED">{t('purchases.statusCancelled')}</option>
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={ShoppingBag}
            title={t('purchases.noPurchasesFound')}
            description={t('purchases.noPurchasesFoundDesc')}
            action={
              canCreate ? (
                <Link to="/purchases/new">
                  <Button variant="primary" size="sm">
                    {t('purchases.createPurchase')}
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
                  <th className="py-3.5 px-4 text-start">{t('purchases.colInvoiceNumber')}</th>
                  <th className="py-3.5 px-4 text-start">{t('suppliers.colSupplier')}</th>
                  <th className="py-3.5 px-4 text-start">{t('purchases.colPurchaseDate')}</th>
                  <th className="py-3.5 px-4 text-start">{t('purchases.colItemsCount')}</th>
                  <th className="py-3.5 px-4 text-start">{t('purchases.colTotal')}</th>
                  <th className="py-3.5 px-4 text-start">{t('common.status')}</th>
                  <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {purchases.map((purchase: Purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {purchase.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {purchase.supplier?.name || purchase.supplierName || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(purchase.purchaseDate || purchase.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {purchase.items?.length || 0} {t('dashboard.itemsUnit')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-sky-600 dark:text-sky-400 text-sm">
                      {formatCurrency(purchase.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <PurchaseStatusBadge status={purchase.status} />
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <Link
                        to={`/purchases/${purchase.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 font-bold transition-colors"
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
