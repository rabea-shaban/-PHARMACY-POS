import React from 'react';
import { useTranslation } from 'react-i18next';
import { KPICard } from '../../dashboard/components/KPICard.js';
import { Boxes, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { useInventorySummary } from '../hooks/useInventory.js';

export const StockSummaryCards: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useInventorySummary();

  const summary = data?.summary;
  const health = data?.health;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Stock Units */}
      <KPICard
        title={t('inventory.totalStockUnits')}
        value={`${summary?.totalStockUnits ?? 0} ${t('dashboard.unitsUnit')}`}
        subtitle={`${t('inventory.totalActiveBatches')}: ${summary?.totalActiveBatches ?? 0}`}
        icon={Boxes}
        variant="primary"
        isLoading={isLoading}
      />

      {/* Healthy Stock */}
      <KPICard
        title={t('inventory.healthyStockUnits')}
        value={`${health?.healthyStockUnits ?? 0} ${t('dashboard.unitsUnit')}`}
        subtitle={t('inventory.healthyStockDesc')}
        icon={ShieldCheck}
        variant="success"
        isLoading={isLoading}
      />

      {/* Low Stock Items Count */}
      <KPICard
        title={t('inventory.lowStockItemsCount')}
        value={`${health?.lowStockProductsCount ?? 0} ${t('dashboard.itemsUnit')}`}
        subtitle={t('inventory.lowStockItemsDesc')}
        icon={AlertTriangle}
        variant={health?.lowStockProductsCount && health.lowStockProductsCount > 0 ? 'warning' : 'info'}
        isLoading={isLoading}
      />

      {/* Expiring Soon Units */}
      <KPICard
        title={t('inventory.expiringSoonUnits')}
        value={`${health?.expiringSoonStockUnits ?? 0} ${t('dashboard.unitsUnit')}`}
        subtitle={t('inventory.expiringSoonDesc')}
        icon={Clock}
        variant={health?.expiringSoonStockUnits && health.expiringSoonStockUnits > 0 ? 'danger' : 'info'}
        isLoading={isLoading}
      />
    </div>
  );
};
