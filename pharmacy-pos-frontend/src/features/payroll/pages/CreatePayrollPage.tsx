import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useGeneratePayroll } from '../hooks/usePayroll.js';
import { PayrollForm } from '../components/PayrollForm.js';
import { GeneratePayrollFormValues } from '../schemas/payrollSchemas.js';
import { Coins, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const CreatePayrollPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { direction } = useAppSelector((state) => state.ui);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const generateMutation = useGeneratePayroll();

  const handleSubmit = async (values: GeneratePayrollFormValues) => {
    setErrorMessage(null);
    try {
      const created = await generateMutation.mutateAsync({
        userId: values.userId,
        periodStart: values.periodStart,
        periodEnd: values.periodEnd,
        baseSalary: Number(values.baseSalary),
        bonus: Number(values.bonus || 0),
        deductions: Number(values.deductions || 0),
      });

      navigate(`/payroll/${created.id}`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <Link
          to="/payroll"
          className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
        >
          {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>توليد مسير راتب موظف</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحديد فترة المسير، الراتب الأساسي، والمكافآت مع احتساب العمولات البيعية تلقائياً
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <PayrollForm
        onSubmit={handleSubmit}
        isLoading={generateMutation.isPending}
      />
    </div>
  );
};
