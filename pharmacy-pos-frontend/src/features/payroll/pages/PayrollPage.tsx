import React, { useState } from 'react';
import {
  usePayrolls,
  usePayrollSummary,
  useApprovePayroll,
} from '../hooks/usePayroll.js';
import { PayrollTable } from '../components/PayrollTable.js';
import { PayrollFilters } from '../components/PayrollFilters.js';
import { PayrollSummaryCards } from '../components/PayrollSummaryCards.js';
import { GeneratePeriodPayrollModal } from '../components/GeneratePeriodPayrollModal.js';
import { PayrollPaymentModal } from '../components/PayrollPaymentModal.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { showConfirmDialog } from '../../../lib/alerts.js';
import { Payroll } from '../types/payroll.types.js';
import { Coins, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PayrollPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [payingPayroll, setPayingPayroll] = useState<Payroll | null>(null);

  const { data, isLoading } = usePayrolls({
    page,
    limit: 15,
    status: (status as any) || undefined,
    periodStart: periodStart || undefined,
    periodEnd: periodEnd || undefined,
  });

  const { data: summary } = usePayrollSummary();
  const approveMutation = useApprovePayroll();

  const payrolls = data?.items || [];
  const pagination = data?.pagination;

  const handleResetFilters = () => {
    setStatus('');
    setPeriodStart('');
    setPeriodEnd('');
    setPage(1);
  };

  const handleApprove = async (payroll: Payroll) => {
    const confirmed = await showConfirmDialog({
      title: 'اعتماد مسير الراتب',
      text: `هل أنت متأكد من رغبتك في اعتماد مسير راتب (${payroll.employeeName})؟`,
      confirmButtonText: 'نعم، اعتماد الراتب',
      cancelButtonText: 'إلغاء',
      icon: 'question',
    });
    if (confirmed) {
      await approveMutation.mutateAsync(payroll.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>مسيرات الرواتب والأجور (Staff Payroll & Wages)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة المرتبات، العمولات البيعية المكتسبة، المكافآت، الاستقطاعات، وإصدار قسائم الرواتب
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsPeriodModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4 text-indigo-600" />}
          >
            توليد مسير شهري جماعي
          </Button>

          <Link to="/payroll/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              توليد مسير موظف
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && <PayrollSummaryCards summary={summary} />}

      {/* Filters */}
      <PayrollFilters
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        periodStart={periodStart}
        onPeriodStartChange={(val) => {
          setPeriodStart(val);
          setPage(1);
        }}
        periodEnd={periodEnd}
        onPeriodEndChange={(val) => {
          setPeriodEnd(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Payroll Table */}
      {!isLoading && payrolls.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Coins}
            title="لا توجد مسيرات رواتب مسجلة"
            description="لم يتم العثور على أي مسيرات رواتب تطابق خيارات الفلترة المحددة."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPeriodModalOpen(true)}
              >
                توليد مسير شهري جماعي
              </Button>
            }
          />
        </Card>
      ) : (
        <PayrollTable
          payrolls={payrolls}
          isLoading={isLoading}
          onApprove={handleApprove}
          onPay={(p) => setPayingPayroll(p)}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}

      {/* Modals */}
      <GeneratePeriodPayrollModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
      />

      <PayrollPaymentModal
        isOpen={Boolean(payingPayroll)}
        onClose={() => setPayingPayroll(null)}
        payroll={payingPayroll}
      />
    </div>
  );
};
