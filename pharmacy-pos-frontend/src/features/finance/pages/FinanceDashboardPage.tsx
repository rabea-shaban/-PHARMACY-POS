import React, { useState } from 'react';
import { useFinancialSummary } from '../hooks/useFinance.js';
import { FinancialMetricsCards } from '../components/FinancialMetricsCards.js';
import { FinancialBreakdownChart } from '../components/FinancialBreakdownChart.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { Landmark, CreditCard, Wallet, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinanceDashboardPage: React.FC = () => {

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: summary, isLoading } = useFinancialSummary({
    from: from || undefined,
    to: to || undefined,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Landmark className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>لوحة المؤشرات والتقارير المالية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ملخص الأداء المالي، تدفقات المبيعات، تكاليف المشتريات، والمصروفات التشغيلية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/payments">
            <Button
              variant="outline"
              size="md"
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              سجل المدفوعات
            </Button>
          </Link>

          <Link to="/expenses">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Wallet className="w-4 h-4" />}
            >
              المصروفات التشغيلية
            </Button>
          </Link>
        </div>
      </div>

      {/* Date Filter Bar */}
      <Card className="rounded-3xl shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>الفترة المحاسبية:</span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="date"
              placeholder="من تاريخ"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="إلى تاريخ"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {(from || to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFrom('');
                setTo('');
              }}
            >
              إعادة تعيين الفترة
            </Button>
          )}
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <FinancialMetricsCards metrics={summary?.metrics} isLoading={isLoading} />

      {/* Breakdown Chart */}
      <FinancialBreakdownChart data={summary} isLoading={isLoading} />
    </div>
  );
};
