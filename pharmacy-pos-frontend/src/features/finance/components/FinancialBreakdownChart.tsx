import React from 'react';
import { FinancialSummaryResponse } from '../types/finance.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

export interface FinancialBreakdownChartProps {
  data?: FinancialSummaryResponse;
  isLoading: boolean;
}

export const FinancialBreakdownChart: React.FC<FinancialBreakdownChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />;
  }

  if (!data) return null;

  const chartData = [
    {
      name: 'صافي المبيعات',
      value: data.metrics.netSales,
      color: '#0284c7', // Sky-600
    },
    {
      name: 'المشتريات المستلمة',
      value: data.metrics.receivedPurchasesCost,
      color: '#4f46e5', // Indigo-600
    },
    {
      name: 'المصروفات التشغيلية',
      value: data.metrics.operatingExpenses,
      color: '#e11d48', // Rose-600
    },
    {
      name: 'عمولات الموظفين',
      value: data.metrics.netStaffCommissions,
      color: '#9333ea', // Purple-600
    },
    {
      name: 'المرتجعات والمستردات',
      value: data.metrics.returnsAndRefunds,
      color: '#d97706', // Amber-600
    },
  ];

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-[#1E293B] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-sky-600" />
          <CardTitle className="text-sm">توزيع التدفقات المالية والتشغيلية</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value) || 0), 'القيمة']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
