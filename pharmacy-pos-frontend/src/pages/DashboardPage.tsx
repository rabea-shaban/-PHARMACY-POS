import React from 'react';
import { useAppSelector } from '../store/hooks.js';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader.js';
import { KPIGrid } from '../features/dashboard/components/KPIGrid.js';
import { SalesChart } from '../features/dashboard/components/SalesChart.js';
import { QuickActions } from '../features/dashboard/components/QuickActions.js';
import { RecentSales } from '../features/dashboard/components/RecentSales.js';
import { LowStockWidget } from '../features/dashboard/components/LowStockWidget.js';
import { ExpiryAlertsWidget } from '../features/dashboard/components/ExpiryAlertsWidget.js';
import { BranchPerformanceWidget } from '../features/dashboard/components/BranchPerformanceWidget.js';
import { FinancialHealthWidget } from '../features/dashboard/components/FinancialHealthWidget.js';
import { BranchTransfersWidget } from '../features/dashboard/components/BranchTransfersWidget.js';

export const DashboardPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Live Refresh */}
      <DashboardHeader />

      {/* 2. Top KPI Cards */}
      <KPIGrid />

      {/* 3. Role-Aware Quick Actions */}
      <QuickActions />

      {/* 4. Multi-Branch Performance & Financial Health (For Pharmacy Manager & Super Admin) */}
      {(role === 'PHARMACY_MANAGER' || role === 'PLATFORM_MANAGER') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BranchPerformanceWidget />
          <FinancialHealthWidget />
        </div>
      )}

      {/* 5. Financial Health specifically for Accountant */}
      {role === 'ACCOUNTANT' && (
        <div>
          <FinancialHealthWidget />
        </div>
      )}

      {/* 6. Sales Analytics & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>

      {/* 7. Transfers and Stock Distribution (For Branch Manager & Pharmacy Manager) */}
      {(role === 'BRANCH_MANAGER' || role === 'PHARMACY_MANAGER' || role === 'PLATFORM_MANAGER') && (
        <div>
          <BranchTransfersWidget />
        </div>
      )}

      {/* 8. Inventory Health & Expiry Alerts (FEFO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockWidget />
        <ExpiryAlertsWidget />
      </div>
    </div>
  );
};
