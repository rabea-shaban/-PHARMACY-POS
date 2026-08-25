import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/common/PageHeader.js';
import { StatCard } from '../components/common/StatCard.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { DollarSign, ShoppingBag, Store, Globe, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.subtitle')}
        actions={
          <Link to="/pos">
            <Button variant="primary" leftIcon={<ShoppingCart className="w-4 h-4" />}>
              {t('dashboard.openPos')}
            </Button>
          </Link>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={t('dashboard.totalSales')}
          value={`24,850 ${t('common.currency')}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 12.5, isPositive: true }}
          cardType="totalSales"
        />
        <StatCard
          title={t('dashboard.inStoreSales')}
          value={`18,320 ${t('common.currency')}`}
          icon={<Store className="w-5 h-5" />}
          trend={{ value: 6.4, isPositive: true }}
          cardType="inStore"
        />
        <StatCard
          title={t('dashboard.onlineSales')}
          value={`6,530 ${t('common.currency')}`}
          icon={<Globe className="w-5 h-5" />}
          trend={{ value: 18.2, isPositive: true }}
          cardType="online"
        />
        <StatCard
          title={t('dashboard.totalOrders')}
          value="142"
          subtitle={`${t('dashboard.averageBasket')}: 175 ${t('common.currency')}`}
          icon={<ShoppingBag className="w-5 h-5" />}
          cardType="orders"
        />
      </div>

      {/* Overview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>{t('dashboard.weeklySalesChart')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-10 text-center text-slate-400 text-sm">
              {t('dashboard.chartPlaceholder')}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>{t('dashboard.topSellingProducts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-10 text-center text-slate-400 text-sm">
              {t('dashboard.topProductsPlaceholder')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
