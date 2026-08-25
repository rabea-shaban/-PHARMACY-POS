import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useRecentSales } from '../hooks/useDashboard.js';
import { formatCurrency, formatDateTime } from '../../../lib/utils.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Receipt, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const RecentSales: React.FC = () => {
  const { t } = useTranslation();
  const { data: sales, isLoading, isError } = useRecentSales();
  const { direction } = useAppSelector((state) => state.ui);

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">{t('dashboard.recentSalesTitle')}</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('dashboard.recentSalesSubtitle')}
          </p>
        </div>

        <Link
          to="/sales"
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 transition-colors"
        >
          <span>{t('dashboard.viewAllSales')}</span>
          {direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError || !sales || sales.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={t('dashboard.noRecentSales')}
            description={t('dashboard.noRecentSalesDesc')}
          />
        ) : (
          <div className="space-y-2.5">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#0B0F17]/60 border border-slate-100 dark:border-[#1E293B] hover:border-sky-200 dark:hover:border-[#2A3B56] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {sale.invoiceNumber}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {sale.customerName ? `${sale.customerName} • ` : ''}
                      {formatDateTime(sale.date)}
                    </p>
                  </div>
                </div>

                <div className="text-end shrink-0 ps-3">
                  <p className="font-black text-xs text-sky-600 dark:text-sky-400">
                    {formatCurrency(sale.total)}
                  </p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {sale.status === 'COMPLETED' ? (direction === 'rtl' ? 'مكتملة' : 'Completed') : sale.status}
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
