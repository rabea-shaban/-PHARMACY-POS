import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks.js';
import { Button } from '../../../components/ui/Button.js';
import { ShoppingCart, RefreshCw, Store, Landmark, LayoutGrid, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { UserRoleBadge } from '../../users/components/UserRoleBadge.js';

export const DashboardHeader: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user, role } = useAppSelector((state) => state.auth);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    await queryClient.invalidateQueries({ queryKey: ['reports'] });
    await queryClient.invalidateQueries({ queryKey: ['branches'] });
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const getDashboardSubtitle = () => {
    switch (role) {
      case 'PHARMACY_MANAGER':
        return t('dashboard.pharmacyManagerView');
      case 'BRANCH_MANAGER':
        return `${t('dashboard.branchManagerView')} — ${user?.branch?.name || t('branches.branch')}`;
      case 'ACCOUNTANT':
        return t('dashboard.accountantView');
      case 'PLATFORM_MANAGER':
        return t('dashboard.superAdminView');
      default:
        return t('dashboard.subtitle');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-[#1E293B]">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('dashboard.title')}
          </h1>
          {role && <UserRoleBadge role={role} />}
          {user?.branch && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
              <Store className="w-3 h-3" />
              {user.branch.name}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {getDashboardSubtitle()} • {user?.name ? `${t('dashboard.welcome')} ${user.name}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] bg-white dark:bg-[#131B2A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C273B] transition-all cursor-pointer shadow-xs"
          title={t('common.refresh')}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
        </button>

        {/* Role-Specific Action Buttons */}
        {role === 'PHARMACY_MANAGER' && (
          <>
            <Link to="/inventory/matrix">
              <Button variant="secondary" size="md" leftIcon={<LayoutGrid className="w-4 h-4" />}>
                {t('dashboard.actionMatrix')}
              </Button>
            </Link>
            <Link to="/branches">
              <Button variant="primary" size="md" leftIcon={<Store className="w-4 h-4" />}>
                {t('dashboard.actionBranches')}
              </Button>
            </Link>
          </>
        )}

        {role === 'ACCOUNTANT' && (
          <>
            <Link to="/expenses/new">
              <Button variant="secondary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
                {t('dashboard.actionAddExpense')}
              </Button>
            </Link>
            <Link to="/finance">
              <Button variant="primary" size="md" leftIcon={<Landmark className="w-4 h-4" />}>
                {t('dashboard.actionFinance')}
              </Button>
            </Link>
          </>
        )}

        {(role === 'BRANCH_MANAGER' || role === 'PHARMACIST' || role === 'PLATFORM_MANAGER') && (
          <Link to="/pos">
            <Button variant="primary" size="md" leftIcon={<ShoppingCart className="w-4 h-4" />}>
              {t('dashboard.openPos')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
