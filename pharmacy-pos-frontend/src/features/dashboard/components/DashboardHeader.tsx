import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks.js';
import { Button } from '../../../components/ui/Button.js';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export const DashboardHeader: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('dashboard.subtitle')} • {user?.name ? `${t('dashboard.welcome')} ${user.name}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] bg-white dark:bg-[#131B2A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C273B] transition-all cursor-pointer shadow-xs"
          title={t('common.refresh')}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
        </button>

        <Link to="/pos">
          <Button variant="primary" size="md" leftIcon={<ShoppingCart className="w-4 h-4" />}>
            {t('dashboard.openPos')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
