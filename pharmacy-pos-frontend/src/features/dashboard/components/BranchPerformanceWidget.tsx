import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useBranches } from '../../branches/hooks/useBranches.js';
import { Store, MapPin, Phone, ArrowRight, LayoutGrid, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge.js';

export const BranchPerformanceWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data: branchesData, isLoading } = useBranches({ limit: 10 });
  const branches = branchesData?.items || [];

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">{t('dashboard.branchComparisonTitle')}</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('dashboard.branchComparisonSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inventory/matrix"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t('dashboard.actionMatrix')}</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link
            to="/branches"
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>{t('dashboard.actionBranches')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
            {t('branches.noBranches')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#223049] bg-slate-50/50 dark:bg-[#131B2A] flex items-center justify-between gap-3 hover:border-teal-300 dark:hover:border-teal-600 transition-all"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {branch.name}
                    </span>
                    <Badge variant={branch.isActive ? 'success' : 'neutral'}>
                      {branch.code}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    {branch.address && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {branch.address}
                      </span>
                    )}
                    {branch.phone && (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {branch.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                  {branch.isActive ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      نشط
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      موقف
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
