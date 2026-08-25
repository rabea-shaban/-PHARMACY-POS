import React from 'react';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader.js';
import { KPIGrid } from '../features/dashboard/components/KPIGrid.js';
import { SalesChart } from '../features/dashboard/components/SalesChart.js';
import { QuickActions } from '../features/dashboard/components/QuickActions.js';
import { RecentSales } from '../features/dashboard/components/RecentSales.js';
import { LowStockWidget } from '../features/dashboard/components/LowStockWidget.js';
import { ExpiryAlertsWidget } from '../features/dashboard/components/ExpiryAlertsWidget.js';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Live Refresh */}
      <DashboardHeader />

      {/* 2. Top KPI Cards */}
      <KPIGrid />

      {/* 3. Role-Aware Quick Actions */}
      <QuickActions />

      {/* 4. Sales Analytics & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>

      {/* 5. Inventory Health & Expiry Alerts (FEFO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockWidget />
        <ExpiryAlertsWidget />
      </div>
    </div>
  );
};
