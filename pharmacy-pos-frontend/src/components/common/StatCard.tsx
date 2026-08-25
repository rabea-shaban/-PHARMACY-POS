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
  color?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate';
}

const colorStyles = {
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'emerald',
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {value}
            </h4>
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1.5 text-xs font-bold">
                <span className={trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                  {trend.isPositive ? '↑ +' : '↓ -'}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-slate-400 font-normal">مقارنة بالأمس</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-2xl shrink-0', colorStyles[color])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
