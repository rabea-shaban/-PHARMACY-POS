import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useSalesOverview } from '../hooks/useDashboard.js';
import { TimeRangeOption } from '../types/dashboard.types.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '../../../lib/utils.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { BarChart3 } from 'lucide-react';

export const SalesChart: React.FC = () => {
  const { t } = useTranslation();
  const [range, setRange] = useState<TimeRangeOption>('7days');
  const { data, isLoading, isError } = useSalesOverview(range);

  const chartData = data?.dailyTrend?.map((item) => ({
    date: item.date.slice(5), // MM-DD
    fullDate: item.date,
    amount: item.grossAmount,
    count: item.salesCount,
  })) || [];

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base">{t('dashboard.salesTrendTitle')}</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('dashboard.salesTrendSubtitle')}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#223049] text-xs font-bold">
          <button
            type="button"
            onClick={() => setRange('7days')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              range === '7days'
                ? 'bg-white dark:bg-[#131B2A] text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('dashboard.sevenDays')}
          </button>
          <button
            type="button"
            onClick={() => setRange('30days')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              range === '30days'
                ? 'bg-white dark:bg-[#131B2A] text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('dashboard.thirtyDays')}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-64 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse flex items-center justify-center text-slate-400 text-xs">
            {t('common.loading')}
          </div>
        ) : isError || chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <EmptyState
              icon={BarChart3}
              title={t('dashboard.noSalesData')}
              description={t('dashboard.noSalesDataDesc')}
            />
          </div>
        ) : (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-[#223049] shadow-lg text-xs space-y-1">
                          <p className="font-bold text-slate-500 dark:text-slate-400">{d.fullDate}</p>
                          <p className="font-black text-sky-600 dark:text-sky-400 text-sm">
                            {formatCurrency(d.amount)}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            {d.count} {t('dashboard.ordersUnit')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
