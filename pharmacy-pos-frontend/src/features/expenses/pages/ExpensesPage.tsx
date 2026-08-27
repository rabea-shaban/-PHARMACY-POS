import React, { useState } from 'react';
import { useExpenses, useExpenseSummary, useDeleteExpense } from '../hooks/useExpenses.js';
import { ExpenseTable } from '../components/ExpenseTable.js';
import { ExpenseFilters } from '../components/ExpenseFilters.js';
import { ExpenseSummaryCards } from '../components/ExpenseSummaryCards.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { showConfirmDialog } from '../../../lib/alerts.js';
import { Wallet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const ExpensesPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { data: summary, isLoading: isLoadingSummary } = useExpenseSummary();
  const { data, isLoading } = useExpenses({
    page,
    limit: 15,
    search: search || undefined,
    category: (category as any) || undefined,
    paymentMethod: (paymentMethod as any) || undefined,
  });

  const deleteExpenseMutation = useDeleteExpense();

  const expenses = data?.items || [];
  const pagination = data?.pagination;

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'].includes(role);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setPaymentMethod('');
    setPage(1);
  };

  const handleDeleteExpense = async (id: string) => {
    const confirmed = await showConfirmDialog({
      title: 'حذف سند المصروف',
      text: 'هل أنت متأكد من رغبتك في حذف سند المصروف هذا نهائياً من السجلات؟',
      confirmButtonText: 'نعم، حذف السند',
      cancelButtonText: 'إلغاء',
      isDanger: true,
    });
    if (confirmed) {
      await deleteExpenseMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>المصروفات التشغيلية والنثريات</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            سجل التدقيق لكافة المصروفات التشغيلية، الإيجارات، المرافق، وسندات الصرف النقدية
          </p>
        </div>

        {canCreate && (
          <Link to="/expenses/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              تسجيل مصروف جديد
            </Button>
          </Link>
        )}
      </div>

      {/* Summary KPI Cards */}
      <ExpenseSummaryCards summary={summary} isLoading={isLoadingSummary} />

      {/* Filters */}
      <ExpenseFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Expenses Table */}
      {!isLoading && expenses.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Wallet}
            title="لا توجد مصروفات مسجلة"
            description="لم يتم العثور على أي سندات صرف تطابق معايير البحث الحالية."
            action={
              canCreate ? (
                <Link to="/expenses/new">
                  <Button variant="primary" size="sm">
                    إضافة سند مصروف جديد
                  </Button>
                </Link>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <ExpenseTable
          expenses={expenses}
          isLoading={isLoading}
          onDelete={handleDeleteExpense}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
