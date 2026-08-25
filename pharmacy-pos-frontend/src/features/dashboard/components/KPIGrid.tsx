import React from 'react';
import { useTranslation } from 'react-i18next';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { formatCurrency } from '../../../lib/utils.js';
import { DollarSign, ShoppingBag, AlertTriangle, Clock } from 'lucide-react';

export const KPIGrid: React.FC = () => {
  const { t } = useTranslation();
  const { data: kpis, isLoading } = useDashboardKPIs();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Today Revenue */}
      <KPICard
        title={t('dashboard.todayRevenue')}
        value={formatCurrency(kpis?.todayRevenue ?? 0)}
        subtitle={`${t('dashboard.invoiceCount')}: ${kpis?.invoiceCount ?? 0}`}
        icon={DollarSign}
        variant="primary"
        isLoading={isLoading}
      />

      {/* 2. Today Invoices / Sales Count */}
      <KPICard
        title={t('dashboard.todayOrders')}
        value={`${kpis?.todaySales ?? 0} ${t('dashboard.ordersUnit')}`}
        subtitle={`${t('dashboard.averageBasket')}: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`}
        icon={ShoppingBag}
        variant="success"
        isLoading={isLoading}
      />

      {/* 3. Low Stock Items */}
      <KPICard
        title={t('dashboard.lowStockItems')}
        value={`${kpis?.lowStockCount ?? 0} ${t('dashboard.itemsUnit')}`}
        subtitle={t('dashboard.lowStockSubtitle')}
        icon={AlertTriangle}
        variant={kpis?.lowStockCount && kpis.lowStockCount > 0 ? 'warning' : 'info'}
        isLoading={isLoading}
      />

      {/* 4. Expiring Soon Batches (FEFO) */}
      <KPICard
        title={t('dashboard.expiringSoon')}
        value={`${kpis?.expiringSoonCount ?? 0} ${t('dashboard.unitsUnit')}`}
        subtitle={t('dashboard.expiringSoonSubtitle')}
        icon={Clock}
        variant={kpis?.expiringSoonCount && kpis.expiringSoonCount > 0 ? 'danger' : 'info'}
        isLoading={isLoading}
      />
    </div>
  );
};
