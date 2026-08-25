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
    card: 'bg-[#EBF5FB] border-[#D4E9F7] text-[#0C4A6E] dark:bg-[#0C2533] dark:border-cyan-800/50 dark:text-cyan-100',
    title: 'text-[#0369A1] dark:text-cyan-300',
    value: 'text-[#0C4A6E] dark:text-cyan-50',
    iconBg: 'bg-[#D0E8F7] text-[#0284C7] dark:bg-cyan-900/60 dark:text-cyan-300',
    trendPos: 'text-[#0284C7] dark:text-cyan-300',
  },
  inStore: {
    card: 'bg-[#E8F8F5] border-[#D1F2EB] text-[#117A65] dark:bg-[#0E2C24] dark:border-emerald-800/50 dark:text-emerald-100',
    title: 'text-[#0E6251] dark:text-emerald-300',
    value: 'text-[#117A65] dark:text-emerald-50',
    iconBg: 'bg-[#D1F2EB] text-[#16A085] dark:bg-emerald-900/60 dark:text-emerald-300',
    trendPos: 'text-[#16A085] dark:text-emerald-300',
  },
  online: {
    card: 'bg-[#EEF2FF] border-[#E0E7FF] text-[#3730A3] dark:bg-[#1E1B4B] dark:border-indigo-800/50 dark:text-indigo-100',
    title: 'text-[#4338CA] dark:text-indigo-300',
    value: 'text-[#312E81] dark:text-indigo-50',
    iconBg: 'bg-[#E0E7FF] text-[#4F46E5] dark:bg-indigo-900/60 dark:text-indigo-300',
    trendPos: 'text-[#4F46E5] dark:text-indigo-300',
  },
  orders: {
    card: 'bg-white border-[#E1EDF4] text-slate-900 dark:bg-[#131B2A] dark:border-[#223049] dark:text-slate-100',
    title: 'text-slate-500 dark:text-slate-400',
    value: 'text-slate-900 dark:text-white',
    iconBg: 'bg-sky-50 text-sky-600 dark:bg-[#1E293B] dark:text-slate-300',
    trendPos: 'text-sky-600 dark:text-sky-400',
  },
  default: {
    card: 'bg-white border-[#E1EDF4] text-slate-900 dark:bg-[#131B2A] dark:border-[#223049] dark:text-slate-100',
    title: 'text-slate-500 dark:text-slate-400',
    value: 'text-slate-900 dark:text-white',
    iconBg: 'bg-sky-50 text-sky-600 dark:bg-[#1E293B] dark:text-slate-300',
    trendPos: 'text-sky-600 dark:text-sky-400',
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
    <Card className={cn('hover:shadow-md transition-all rounded-3xl shadow-xs', styles.card)}>
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
