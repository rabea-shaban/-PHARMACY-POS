import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getExpenseSchema, ExpenseFormValues } from '../schemas/expenseSchemas.js';
import { Expense } from '../types/expense.types.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { DollarSign, Calendar, CreditCard, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  isLoading: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(getExpenseSchema()),
    defaultValues: {
      amount: initialData?.amount || ('' as any),
      category: initialData?.category || 'OTHER',
      description: initialData?.description || '',
      paymentMethod: initialData?.paymentMethod || 'CASH',
      expenseDate: initialData?.expenseDate
        ? initialData.expenseDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">بيانات وتفاصيل سند الصرف</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          {/* Amount */}
          <div>
            <Input
              type="number"
              step="0.01"
              label="قيمة المصروف (ج.م) *"
              placeholder="مثال: 500"
              error={errors.amount?.message}
              {...register('amount')}
              leftIcon={<DollarSign className="w-4 h-4 text-emerald-600" />}
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              بند وتصنيف المصروف *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <select
                {...register('category')}
                className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="RENT">إيجار الصيدلية (RENT)</option>
                <option value="ELECTRICITY">كهرباء ومرافق وفواتير (ELECTRICITY)</option>
                <option value="MAINTENANCE">صيانة وتصليحات (MAINTENANCE)</option>
                <option value="SUPPLIES">أدوات ومستلزمات نظافة وتشغيل (SUPPLIES)</option>
                <option value="SALARY">رواتب وعمالة مؤقتة (SALARY)</option>
                <option value="OTHER">نثريات ومصروفات عامة (OTHER)</option>
              </select>
            </div>
            {errors.category && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              طريقة دفع المصروف *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <select
                {...register('paymentMethod')}
                className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="CASH">نقدي من درج الكاشير (CASH)</option>
                <option value="VISA">بطاقة بنكية / فيزا (VISA)</option>
                <option value="WALLET">محفظة إلكترونية (WALLET)</option>
                <option value="OTHER">أخرى (OTHER)</option>
              </select>
            </div>
          </div>

          {/* Expense Date */}
          <div>
            <Input
              type="date"
              label="تاريخ الصرف *"
              error={errors.expenseDate?.message}
              {...register('expenseDate')}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              الوصف والبيان التفصيلي *
            </label>
            <textarea
              rows={3}
              placeholder="اكتب تفاصيل المصروف، سبب الصرف، رقم الفاتورة أو الجهة المصروف لها..."
              {...register('description')}
              className="w-full rounded-2xl border p-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to="/expenses">
          <Button type="button" variant="outline" size="md">
            {t('common.cancel')}
          </Button>
        </Link>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          {initialData ? 'حفظ تعديلات المصروف' : 'تسجيل المصروف وتأكيد الصرف'}
        </Button>
      </div>
    </form>
  );
};
