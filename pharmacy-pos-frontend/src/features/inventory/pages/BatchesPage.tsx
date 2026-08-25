import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBatches } from '../hooks/useInventory.js';
import { Card } from '../../../components/ui/Card.js';
import { Input } from '../../../components/ui/Input.js';
import { Button } from '../../../components/ui/Button.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { InventoryAdjustmentModal } from '../components/InventoryAdjustmentModal.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Layers, Search, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';
import { BatchItem } from '../types/inventory.types.js';

export const BatchesPage: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);

  const { data, isLoading } = useBatches({ page, limit: 15, search: search || undefined });
  const batches = data?.items || [];
  const pagination = data?.pagination;

  const canAdjust = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('inventory.batchesPageTitle')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('inventory.batchesPageSubtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs max-w-md">
        <Input
          placeholder={t('inventory.searchBatchesPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Batches Table */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Layers}
            title={t('inventory.noBatchesFound')}
            description={t('inventory.noBatchesFoundDesc')}
          />
        </Card>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">{t('products.colProduct')}</th>
                  <th className="py-3.5 px-4 text-start">{t('dashboard.batchNo')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colInitialQty')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colCurrentQty')}</th>
                  <th className="py-3.5 px-4 text-start">{t('products.colSellingPrice')}</th>
                  <th className="py-3.5 px-4 text-start">{t('products.expiryDate')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colFEFOStatus')}</th>
                  {canAdjust && <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {batches.map((batch: BatchItem) => {
                  const exp = new Date(batch.expiryDate);
                  const today = new Date();
                  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isExpired = diffDays <= 0;
                  const isNear = diffDays <= 30 && diffDays > 0;

                  return (
                    <tr
                      key={batch.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {batch.product?.name || batch.productName || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {batch.batchNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {batch.initialQuantity}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                        {batch.quantity} {t('dashboard.unitsUnit')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(batch.sellingPrice)}
                      </td>
                      <td className="py-3.5 px-4">
                        {formatDate(batch.expiryDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-xl font-bold text-[10px] ${
                            isExpired
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : isNear
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {isExpired
                            ? t('products.batchExpired')
                            : isNear
                            ? `${diffDays} ${t('dashboard.daysLeft')}`
                            : t('inventory.batchValid')}
                        </span>
                      </td>
                      {canAdjust && (
                        <td className="py-3.5 px-4 text-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Sliders className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedBatch(batch)}
                          >
                            {t('inventory.adjust')}
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
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

      {/* Stock Adjustment Modal */}
      {selectedBatch && (
        <InventoryAdjustmentModal
          isOpen={Boolean(selectedBatch)}
          onClose={() => setSelectedBatch(null)}
          productId={selectedBatch.productId}
          productName={selectedBatch.product?.name || selectedBatch.productName || 'دواء'}
          batchId={selectedBatch.id}
          batchNumber={selectedBatch.batchNumber}
          currentQuantity={selectedBatch.quantity}
        />
      )}
    </div>
  );
};
