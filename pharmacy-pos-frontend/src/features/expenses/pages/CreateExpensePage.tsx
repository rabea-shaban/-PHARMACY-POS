import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateExpense } from '../hooks/useExpenses.js';
import { ExpenseForm } from '../components/ExpenseForm.js';
import { ExpenseFormValues } from '../schemas/expenseSchemas.js';
import { Wallet, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const CreateExpensePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { direction } = useAppSelector((state) => state.ui);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createExpenseMutation = useCreateExpense();

  const handleSubmit = async (values: ExpenseFormValues) => {
    setErrorMessage(null);
    try {
      await createExpenseMutation.mutateAsync({
        amount: values.amount,
        category: values.category,
        description: values.description,
        paymentMethod: values.paymentMethod,
        expenseDate: values.expenseDate || undefined,
      });

      navigate('/expenses');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <Link
          to="/expenses"
          className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
        >
          {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>تسجيل سند مصروف جديد</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            إثبات مالي لصرف مبالغ الإيجارات، الفواتير، الصيانة، أو النثريات
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Expense Form */}
      <ExpenseForm
        onSubmit={handleSubmit}
        isLoading={createExpenseMutation.isPending}
      />
    </div>
  );
};
