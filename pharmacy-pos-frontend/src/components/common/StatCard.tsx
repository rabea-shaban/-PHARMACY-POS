import React from 'react';
import { Card, CardContent } from '../ui/Card.js';
import { cn } from '../../lib/utils.js';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  cardType?: 'totalSales' | 'inStore' | 'online' | 'orders' | 'default';
}

const cardStyles = {
  totalSales: {
    card: 'bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-[#0E2C24] dark:border-emerald-800/50 dark:text-emerald-100',
    title: 'text-emerald-700 dark:text-emerald-300',
    value: 'text-emerald-950 dark:text-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    trendPos: 'text-emerald-700 dark:text-emerald-300',
  },
  inStore: {
    card: 'bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-[#2C1418] dark:border-rose-800/50 dark:text-rose-100',
    title: 'text-rose-700 dark:text-rose-300',
    value: 'text-rose-950 dark:text-rose-50',
    iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    trendPos: 'text-rose-700 dark:text-rose-300',
  },
  online: {
    card: 'bg-cyan-50/80 border-cyan-200 text-cyan-900 dark:bg-[#0C2533] dark:border-cyan-800/50 dark:text-cyan-100',
    title: 'text-cyan-700 dark:text-cyan-300',
    value: 'text-cyan-950 dark:text-cyan-50',
    iconBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300',
    trendPos: 'text-cyan-700 dark:text-cyan-300',
  },
  orders: {
    card: 'bg-white border-slate-200 text-slate-900 dark:bg-[#131B2A] dark:border-[#223049] dark:text-slate-100',
    title: 'text-slate-500 dark:text-slate-400',
    value: 'text-slate-900 dark:text-white',
    iconBg: 'bg-slate-100 text-slate-700 dark:bg-[#1E293B] dark:text-slate-300',
    trendPos: 'text-emerald-600 dark:text-emerald-400',
  },
  default: {
    card: 'bg-white border-slate-200 text-slate-900 dark:bg-[#131B2A] dark:border-[#223049] dark:text-slate-100',
    title: 'text-slate-500 dark:text-slate-400',
    value: 'text-slate-900 dark:text-white',
    iconBg: 'bg-slate-100 text-slate-700 dark:bg-[#1E293B] dark:text-slate-300',
    trendPos: 'text-emerald-600 dark:text-emerald-400',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  cardType = 'default',
}) => {
  const styles = cardStyles[cardType];

  return (
    <Card className={cn('hover:shadow-md transition-all rounded-3xl', styles.card)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn('text-xs font-bold', styles.title)}>{title}</p>
            <h4 className={cn('text-2xl font-black tracking-tight', styles.value)}>
              {value}
            </h4>
            {subtitle && (
              <p className="text-xs opacity-75 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1.5 text-xs font-bold">
                <span className={trend.isPositive ? styles.trendPos : 'text-rose-500'}>
                  {trend.isPositive ? '↑ +' : '↓ -'}
                  {Math.abs(trend.value)}%
                </span>
                <span className="opacity-60 font-normal">مقارنة بالأمس</span>
              </div>
            )}
          </div>
          <div className={cn('p-3.5 rounded-2xl shrink-0 shadow-xs', styles.iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
