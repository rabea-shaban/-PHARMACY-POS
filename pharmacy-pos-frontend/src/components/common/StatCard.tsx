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
    card: 'bg-[#E7F7B9] border-[#d8efa0] text-[#365A35]',
    title: 'text-[#486b47]',
    value: 'text-[#284827]',
    iconBg: 'bg-[#daf59f] text-[#365A35]',
  },
  inStore: {
    card: 'bg-[#F4B0B2] border-[#eca2a4] text-[#713F42]',
    title: 'text-[#844c50]',
    value: 'text-[#592d30]',
    iconBg: 'bg-[#f09ea1] text-[#713F42]',
  },
  online: {
    card: 'bg-[#91D7CC] border-[#7ecfc2] text-[#245957]',
    title: 'text-[#2a6866]',
    value: 'text-[#184442]',
    iconBg: 'bg-[#7dcbbd] text-[#245957]',
  },
  orders: {
    card: 'bg-[#F7FCFC] border-[#D5E6E5] text-[#0B3031]',
    title: 'text-[#557274]',
    value: 'text-[#0B3031]',
    iconBg: 'bg-[#DDEEEE] text-[#003C3D]',
  },
  default: {
    card: 'bg-[#F7FCFC] border-[#D5E6E5] text-[#0B3031]',
    title: 'text-[#557274]',
    value: 'text-[#0B3031]',
    iconBg: 'bg-[#DDEEEE] text-[#003C3D]',
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
                <span className={trend.isPositive ? 'text-emerald-800' : 'text-rose-800'}>
                  {trend.isPositive ? '↑ +' : '↓ -'}
                  {Math.abs(trend.value)}%
                </span>
                <span className="opacity-60 font-normal">مقارنة بالأمس</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-2xl shrink-0 shadow-xs', styles.iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
