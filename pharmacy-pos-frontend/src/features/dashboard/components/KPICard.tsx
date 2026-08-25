import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { cn } from '../../../lib/utils.js';
import { LucideIcon } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const variantStyles = {
  primary: {
    card: 'border-sky-200/80 dark:border-sky-900/40 bg-white dark:bg-[#131B2A]',
    iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
    valColor: 'text-slate-900 dark:text-white',
  },
  success: {
    card: 'border-emerald-200/80 dark:border-emerald-900/40 bg-white dark:bg-[#131B2A]',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    valColor: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    card: 'border-amber-200/80 dark:border-amber-900/40 bg-white dark:bg-[#131B2A]',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    valColor: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    card: 'border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-[#131B2A]',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    valColor: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    card: 'border-indigo-200/80 dark:border-indigo-900/40 bg-white dark:bg-[#131B2A]',
    iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    valColor: 'text-slate-900 dark:text-white',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
  trend,
  isLoading = false,
}) => {
  const styles = variantStyles[variant];

  return (
    <Card className={cn('hover:shadow-md transition-all rounded-3xl shadow-xs', styles.card)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{title}</p>
            {isLoading ? (
              <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            ) : (
              <h4 className={cn('text-2xl font-black tracking-tight', styles.valColor)}>
                {value}
              </h4>
            )}
            {subtitle && !isLoading && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{subtitle}</p>
            )}
            {trend && !isLoading && (
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold">
                <span className={trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                  {trend.isPositive ? '↑ +' : '↓ -'}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-slate-400 font-normal">مقارنة بالأمس</span>
              </div>
            )}
          </div>
          <div className={cn('p-3.5 rounded-2xl shrink-0 shadow-xs', styles.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
