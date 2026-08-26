import React, { useState } from 'react';
import {
  useCommissionSummary,
  useCommissionTransactions,
} from '../hooks/useCommissions.js';
import { CommissionSummaryCards } from '../components/CommissionSummaryCards.js';
import { CommissionFilters } from '../components/CommissionFilters.js';
import { CommissionTransactionsTable } from '../components/CommissionTransactionsTable.js';
import { StaffCommissionLeaderboard } from '../components/StaffCommissionLeaderboard.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Award, Sparkles, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const CommissionsPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);
  const canManageRules = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: summary } = useCommissionSummary({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: transactionsData, isLoading } = useCommissionTransactions({
    page,
    limit: 15,
    userId: userId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const transactions = transactionsData?.items || [];
  const pagination = transactionsData?.pagination;

  const handleResetFilters = () => {
    setUserId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <span>عمولات وحوافز المبيعات (Staff Sales Commissions)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة عمولات الصيادلة والكاشير، قواعد ونسب العمولات، وتسوية مستحقات الأداء البيعي
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageRules && (
            <Link to="/commissions/rules">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Sliders className="w-4 h-4 text-purple-600" />}
              >
                إدارة قواعد العمولات
              </Button>
            </Link>
          )}

          <Link to="/payroll">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              الانتقال لمسيرات الرواتب (F12)
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && <CommissionSummaryCards summary={summary} />}

      {/* Staff Leaderboard */}
      {summary?.staffSummary && summary.staffSummary.length > 0 && (
        <StaffCommissionLeaderboard staffSummary={summary.staffSummary} />
      )}

      {/* Filters */}
      <CommissionFilters
        userId={userId}
        onUserIdChange={(val) => {
          setUserId(val);
          setPage(1);
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Transactions Journal */}
      {!isLoading && transactions.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Award}
            title="لا توجد حركات عمولات مسجلة"
            description="لم يتم تسجيل أي عمولات مبيعات تطابق معايير الفلترة المحددة."
          />
        </Card>
      ) : (
        <CommissionTransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
