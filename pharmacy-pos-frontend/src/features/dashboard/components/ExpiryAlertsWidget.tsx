import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useExpiringBatches } from '../hooks/useDashboard.js';
import { formatDate } from '../../../lib/utils.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Clock, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const ExpiryAlertsWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data: batches, isLoading, isError } = useExpiringBatches();
  const { direction } = useAppSelector((state) => state.ui);

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">{t('dashboard.expiryAlertsTitle')}</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('dashboard.expiryAlertsSubtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/inventory"
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 transition-colors"
        >
          <span>{t('dashboard.viewBatches')}</span>
          {direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError || !batches || batches.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title={t('dashboard.noExpiringBatches')}
            description={t('dashboard.noExpiringBatchesDesc')}
          />
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {batches.slice(0, 5).map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs"
              >
                <div className="min-w-0 truncate">
                  <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {batch.productName}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t('dashboard.batchNo')}: {batch.batchNumber} • {formatDate(batch.expiryDate)}
                  </p>
                </div>
                <div className="text-end shrink-0 ps-3">
                  <span className="inline-block font-black text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60">
                    {batch.daysRemaining} {t('dashboard.daysLeft')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
