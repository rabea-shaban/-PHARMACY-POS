import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExpiringBatches, useExpiredBatches } from '../hooks/useInventory.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatDate } from '../../../lib/utils.js';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExpiryAlertsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'30days' | '60days' | '90days' | 'expired'>('30days');

  const daysParam = activeTab === '30days' ? 30 : activeTab === '60days' ? 60 : 90;
  const { data: expiringBatches, isLoading: isLoadingExpiring } = useExpiringBatches(daysParam);
  const { data: expiredBatches, isLoading: isLoadingExpired } = useExpiredBatches();

  const isExpiredTab = activeTab === 'expired';
  const isLoading = isExpiredTab ? isLoadingExpired : isLoadingExpiring;
  const batches = isExpiredTab ? (expiredBatches || []) : (expiringBatches || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>{t('inventory.expiryAlertsPageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.expiryAlertsPageSubtitle')}
          </p>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#223049] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('30days')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === '30days'
                ? 'bg-white dark:bg-[#131B2A] text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('inventory.expiring30Days')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('60days')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === '60days'
                ? 'bg-white dark:bg-[#131B2A] text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('inventory.expiring60Days')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('90days')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === '90days'
                ? 'bg-white dark:bg-[#131B2A] text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('inventory.expiring90Days')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expired')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'expired'
                ? 'bg-white dark:bg-[#131B2A] text-rose-700 dark:text-rose-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('inventory.expiredTab')}
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={CheckCircle2}
            title={t('dashboard.noExpiringBatches')}
            description={t('dashboard.noExpiringBatchesDesc')}
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
                  <th className="py-3.5 px-4 text-start">{t('products.expiryDate')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colDaysRemaining')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colCurrentStock')}</th>
                  <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {batches.map((batch: any) => {
                  const days = batch.daysRemaining ?? 0;
                  const isPast = isExpiredTab || days <= 0;

                  return (
                    <tr
                      key={batch.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {batch.productName || batch.product?.name || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {batch.batchNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                        {formatDate(batch.expiryDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-xl font-bold text-[10px] ${
                            isPast
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : days <= 30
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {isPast
                            ? t('products.batchExpired')
                            : `${days} ${t('dashboard.daysLeft')}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                        {batch.currentQuantity || batch.quantity} {t('dashboard.unitsUnit')}
                      </td>
                      <td className="py-3.5 px-4 text-end">
                        <Link
                          to={`/products/${batch.productId}`}
                          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700"
                        >
                          {t('common.view')}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
