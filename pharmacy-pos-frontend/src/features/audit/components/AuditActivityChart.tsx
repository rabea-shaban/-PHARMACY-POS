import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { AuditActivitySummary } from '../types/audit.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Activity, ShieldCheck, UserCheck } from 'lucide-react';

export interface AuditActivityChartProps {
  summary: AuditActivitySummary;
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: '#10B981',
  UPDATE: '#0284C7',
  DELETE: '#F43F5E',
  LOGIN: '#6366F1',
  SALE: '#14B8A6',
  PAYMENT: '#F59E0B',
  RETURN: '#8B5CF6',
  INVENTORY_ADJUSTMENT: '#F97316',
};

export const AuditActivityChart: React.FC<AuditActivityChartProps> = ({ summary }) => {
  const chartData = summary.actionDistribution.map((item) => ({
    name: item.action,
    count: item.count,
    color: ACTION_COLORS[item.action] || '#64748B',
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Action Distribution Bar Chart */}
      <Card className="rounded-3xl shadow-xs lg:col-span-2">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <CardTitle className="text-sm">توزيع العمليات الأمنية (Action Breakdown)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Actors & Entity stats */}
      <div className="space-y-4">
        {/* Top Active Users */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-[#1E293B]">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <CardTitle className="text-sm">أكثر المستخدمين تفاعلاً</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            {summary.topActors.slice(0, 4).map((actor) => (
              <div
                key={actor.userId}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B]"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {actor.userName}
                </span>
                <span className="font-mono font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-lg text-[11px]">
                  {actor.actionCount} حركة
                </span>
              </div>
            ))}
            {summary.topActors.length === 0 && (
              <p className="text-slate-400 text-center py-2">لا توجد حركات مسجلة</p>
            )}
          </CardContent>
        </Card>

        {/* Total Metric Card */}
        <Card className="rounded-3xl shadow-xs bg-linear-to-br from-sky-600 to-indigo-700 text-white p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-100">إجمالي الحركات المسجلة</span>
            <ShieldCheck className="w-5 h-5 text-sky-200" />
          </div>
          <div className="text-2xl font-black font-mono">
            {summary.totalLogsCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-sky-200 mt-1">سجل تدقيق أمني غير قابل للتعديل</p>
        </Card>
      </div>
    </div>
  );
};
