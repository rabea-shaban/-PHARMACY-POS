import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryTransactions } from '../hooks/useInventory.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatDateTime } from '../../../lib/utils.js';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';
import { InventoryTransaction } from '../types/inventory.types.js';

export const InventoryTransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useInventoryTransactions({
    page,
    limit: 15,
    type: typeFilter || undefined,
  });

  const transactions = data?.items || [];
  const pagination = data?.pagination;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SALE':
        return <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold">{t('inventory.typeSale')}</span>;
      case 'PURCHASE':
        return <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">{t('inventory.typePurchase')}</span>;
      case 'SALE_RETURN':
        return <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold">{t('inventory.typeSaleReturn')}</span>;
      case 'PURCHASE_RETURN':
        return <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-bold">{t('inventory.typePurchaseReturn')}</span>;
      case 'ADJUSTMENT':
        return <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold">{t('inventory.typeAdjustment')}</span>;
      case 'DAMAGE':
        return <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold">{t('inventory.typeDamage')}</span>;
      case 'EXPIRED':
        return <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 font-bold">{t('inventory.typeExpired')}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-[#1E293B] font-bold">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('inventory.transactionsPageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.transactionsPageSubtitle')}
          </p>
        </div>

        {/* Type Filter */}
        <div className="w-full sm:w-48">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-white dark:bg-[#131B2A] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="">{t('inventory.allTransactionTypes')}</option>
            <option value="SALE">{t('inventory.typeSale')}</option>
            <option value="PURCHASE">{t('inventory.typePurchase')}</option>
            <option value="SALE_RETURN">{t('inventory.typeSaleReturn')}</option>
            <option value="PURCHASE_RETURN">{t('inventory.typePurchaseReturn')}</option>
            <option value="ADJUSTMENT">{t('inventory.typeAdjustment')}</option>
            <option value="DAMAGE">{t('inventory.typeDamage')}</option>
            <option value="EXPIRED">{t('inventory.typeExpired')}</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={History}
            title={t('inventory.noTransactionsFound')}
            description={t('inventory.noTransactionsFoundDesc')}
          />
        </Card>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colDateTime')}</th>
                  <th className="py-3.5 px-4 text-start">{t('products.colProduct')}</th>
                  <th className="py-3.5 px-4 text-start">{t('dashboard.batchNo')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colTransactionType')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colMovementQty')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colReason')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colStaff')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {transactions.map((tx: InventoryTransaction) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {tx.product?.name || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                      {tx.batch?.batchNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {getTypeBadge(tx.type)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm">
                      <span className={tx.quantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {tx.reason || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {tx.user?.name || '—'}
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
