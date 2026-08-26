import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePayroll } from '../hooks/usePayroll.js';
import { SalarySlipView } from '../components/SalarySlipView.js';
import { Button } from '../../../components/ui/Button.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Printer, ArrowRight, ArrowLeft, Coins } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const SalarySlipPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);

  const { data: payroll, isLoading, isError } = usePayroll(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-96 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !payroll) {
    return (
      <EmptyState
        icon={Coins}
        title="قسيمة الراتب غير موجودة"
        description="لم يتم العثور على سجل مسير الراتب المطلوب لطباعة القسيمة."
      />
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Header controls (Hidden during print) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-[#1E293B] print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to={`/payroll/${payroll.id}`}
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              طباعة قسيمة راتب: {payroll.employeeName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              معاينة جاهزة للطباعة الحرارية أو الورقية A4
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          طباعة القسيمة
        </Button>
      </div>

      {/* Printable Slip Card */}
      <SalarySlipView payroll={payroll} />
    </div>
  );
};
