import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useLowStockItems } from '../hooks/useDashboard.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { AlertTriangle, Boxes, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const LowStockWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data: items, isLoading, isError } = useLowStockItems();
  const { direction } = useAppSelector((state) => state.ui);

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">{t('dashboard.lowStockWidgetTitle')}</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('dashboard.lowStockWidgetSubtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/inventory"
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 transition-colors"
        >
          <span>{t('dashboard.viewInventory')}</span>
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
        ) : isError || !items || items.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title={t('dashboard.noLowStock')}
            description={t('dashboard.noLowStockDesc')}
          />
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs"
              >
                <div className="min-w-0 truncate">
                  <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.productName}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {item.categoryName ? `${item.categoryName} • ` : ''}
                    {t('dashboard.minThreshold')}: {item.minimumStock}
                  </p>
                </div>
                <div className="text-end shrink-0 ps-3">
                  <span className="inline-block font-black text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/60">
                    {item.currentStock} {t('dashboard.unitsUnit')}
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
