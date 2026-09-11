import React from 'react';
import { useTranslation } from 'react-i18next';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { useAppSelector } from '../../../store/hooks.js';
import { formatCurrency } from '../../../lib/utils.js';
import { DollarSign, ShoppingBag, AlertTriangle, Clock, Store } from 'lucide-react';

export const KPIGrid: React.FC = () => {
  const { t } = useTranslation();
  const { role, user } = useAppSelector((state) => state.auth);
  const { data: kpis, isLoading } = useDashboardKPIs();

  const getRevenueTitle = () => {
    switch (role) {
      case 'PHARMACY_MANAGER':
        return 'إجمالي مبيعات الفروع اليوم';
      case 'BRANCH_MANAGER':
        return `مبيعات اليوم (${user?.branch?.name || 'الفرع'})`;
      case 'ACCOUNTANT':
        return 'صافي الإيرادات والتحصيل';
      default:
        return t('dashboard.todayRevenue');
    }
  };

  const getOrdersSubtitle = () => {
    if (role === 'BRANCH_MANAGER' && user?.branch) {
      return `فرع: ${user.branch.name} • المتوسط: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`;
    }
    if (role === 'PHARMACY_MANAGER') {
      return `إجمالي فروع السلسلة • المتوسط: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`;
    }
    return `${t('dashboard.averageBasket')}: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Today Revenue */}
      <KPICard
        title={getRevenueTitle()}
        value={formatCurrency(kpis?.todayRevenue ?? 0)}
        subtitle={`${t('dashboard.invoiceCount')}: ${kpis?.invoiceCount ?? 0}`}
        icon={DollarSign}
        variant="primary"
        isLoading={isLoading}
      />

      {/* 2. Today Invoices / Sales Count */}
      <KPICard
        title={role === 'PHARMACY_MANAGER' ? 'فواتير كافة الفروع' : t('dashboard.todayOrders')}
        value={`${kpis?.todaySales ?? 0} ${t('dashboard.ordersUnit')}`}
        subtitle={getOrdersSubtitle()}
        icon={role === 'BRANCH_MANAGER' ? Store : ShoppingBag}
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
