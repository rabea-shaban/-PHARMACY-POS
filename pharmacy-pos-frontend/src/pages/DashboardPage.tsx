import React from 'react';
import { useAppSelector } from '../store/hooks.js';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader.js';
import { PharmacyManagerDashboard } from '../features/dashboard/components/PharmacyManagerDashboard.js';
import { BranchManagerDashboard } from '../features/dashboard/components/BranchManagerDashboard.js';
import { AccountantDashboard } from '../features/dashboard/components/AccountantDashboard.js';
import { PlatformManagerDashboard } from '../features/dashboard/components/PlatformManagerDashboard.js';
import { PharmacistDashboard } from '../features/dashboard/components/PharmacistDashboard.js';

export const DashboardPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  const renderRoleDashboard = () => {
    switch (role) {
      case 'PHARMACY_MANAGER':
        return <PharmacyManagerDashboard />;
      case 'BRANCH_MANAGER':
        return <BranchManagerDashboard />;
      case 'ACCOUNTANT':
        return <AccountantDashboard />;
      case 'PLATFORM_MANAGER':
        return <PlatformManagerDashboard />;
      case 'PHARMACIST':
        return <PharmacistDashboard />;
      default:
        return <PharmacyManagerDashboard />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Universal Dynamic Header */}
      <DashboardHeader />

      {/* 2. Fully Dedicated Role Dashboard Suite */}
      {renderRoleDashboard()}
    </div>
  );
};
