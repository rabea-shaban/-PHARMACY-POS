import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useExpense, useDeleteExpense } from '../hooks/useExpenses.js';
import { ExpenseCategoryBadge } from '../components/ExpenseCategoryBadge.js';
import { Button } from '../../../components/ui/Button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { showConfirmDialog } from '../../../lib/alerts.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import {
  Wallet,
  Calendar,
  CreditCard,
  User,
  Clock,
  Edit,
  Trash2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  FileText,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const ExpenseDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const { data: expense, isLoading, isError } = useExpense(id);
  const deleteExpenseMutation = useDeleteExpense();

  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const handleDelete = async () => {
    const confirmed = await showConfirmDialog({
      title: 'حذف المصروف نهائياً',
      text: 'هل أنت متأكد من رغبتك في حذف هذا المصروف نهائياً؟',
      confirmButtonText: 'نعم، حذف',
      cancelButtonText: 'إلغاء',
      isDanger: true,
    });
    if (confirmed) {
      await deleteExpenseMutation.mutateAsync(id);
      navigate('/expenses');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !expense) {
    return (
      <EmptyState
        icon={Wallet}
        title="سند المصروف غير موجود"
        description="لم يتم العثور على سجل المصروف المطلوب."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/expenses"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                سند صرف مصروف
              </h1>
              <ExpenseCategoryBadge category={expense.category} />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
              معرف السند: {expense.id}
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Link to={`/expenses/${expense.id}/edit`}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Edit className="w-4 h-4" />}
              >
                {t('common.edit')}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              onClick={handleDelete}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              {t('common.delete')}
            </Button>
          </div>
        )}
      </div>

      {/* Main Details Card */}
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">تفاصيل السند والبيان المالي</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-xs">
          {/* Big Amount Card */}
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                القيمة المصروفة الإجمالية
              </p>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                {formatCurrency(expense.amount)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B0F17] shadow-2xs">
              <DollarSign className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>

          {/* Key Value Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>طريقة الدفع والصرف</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {expense.paymentMethod}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>تاريخ الصرف المحاسبي</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                {formatDate(expense.expenseDate)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <User className="w-3.5 h-3.5" />
                <span>الموظف الذي أنشأ السند</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {expense.createdByName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>تاريخ وساعة التسجيل بالنظام</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                {formatDate(expense.createdAt)}
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>البيان والتفاصيل الكاملة</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {expense.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
