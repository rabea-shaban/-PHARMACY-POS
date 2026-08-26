import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useStaffCommissionTransactions } from '../hooks/useCommissions.js';
import { useUser } from '../../users/hooks/useUsers.js';
import { CommissionStatementView } from '../components/CommissionStatementView.js';
import { Button } from '../../../components/ui/Button.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Printer, ArrowRight, ArrowLeft, Award } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const CommissionStatementPage: React.FC = () => {
  const { userId = '' } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  const { direction } = useAppSelector((state) => state.ui);

  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { data: txData, isLoading: isLoadingTx } = useStaffCommissionTransactions(userId, {
    startDate,
    endDate,
    limit: 1000,
  });

  const transactions = txData?.items || [];
  const isLoading = isLoadingUser || isLoadingTx;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-96 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        icon={Award}
        title="الموظف غير موجود"
        description="لم يتم العثور على سجل الموظف المطلوب لطباعة كشف العمولات."
      />
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header controls (Hidden during print) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-[#1E293B] print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to={`/users/${user.id}`}
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              طباعة كشف عمولات: {user.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              معاينة جاهزة للطباعة والتوقيع المالي
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          طباعة الكشف
        </Button>
      </div>

      {/* Printable Statement View */}
      <CommissionStatementView
        userName={user.name}
        userRole={user.role}
        transactions={transactions}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};
