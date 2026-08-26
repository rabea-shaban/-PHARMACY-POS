import React, { useState } from 'react';
import { useAuditSummary } from '../hooks/useAudit.js';
import { AuditActivityChart } from '../components/AuditActivityChart.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Activity, ShieldCheck, Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input.js';
import { useAppSelector } from '../../../store/hooks.js';

export const SystemActivityPage: React.FC = () => {
  const { direction } = useAppSelector((state) => state.ui);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: summary, isLoading } = useAuditSummary({
    from: from || undefined,
    to: to || undefined,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/audit"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <span>لوحة تحليل النشاط وحركات النظام (System Activity)</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              إحصائيات مجمعة للعمليات الأمنية، أكثر الكيانات تعديلاً، والمستخدمين الأكثر نشاطاً
            </p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-36 text-xs"
          />
          <span className="text-slate-400 text-xs">—</span>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-36 text-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
          <div className="h-48 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
        </div>
      ) : summary ? (
        <div className="space-y-6">
          <AuditActivityChart summary={summary} />

          {/* Entity Distribution List */}
          <Card className="rounded-3xl shadow-xs">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <CardTitle className="text-sm">توزيع الحركات حسب الكيانات (Entity Distribution)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {summary.entityDistribution.map((item) => (
                  <div
                    key={item.entity}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] flex items-center justify-between"
                  >
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {item.entity}
                    </span>
                    <span className="font-mono font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-lg text-xs">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="rounded-3xl p-12 text-center">
          <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-bold">لا توجد بيانات نشاط متاحة</p>
        </Card>
      )}
    </div>
  );
};
