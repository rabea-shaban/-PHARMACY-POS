import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getGeneratePayrollSchema,
  GeneratePayrollFormValues,
} from '../schemas/payrollSchemas.js';
import { useUsers } from '../../users/hooks/useUsers.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { User, Calendar, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PayrollFormProps {
  onSubmit: (values: GeneratePayrollFormValues) => Promise<void>;
  isLoading: boolean;
}

export const PayrollForm: React.FC<PayrollFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    limit: 100,
    isActive: true,
  });

  const staff = usersData?.items || [];

  // Default dates: First and last day of current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GeneratePayrollFormValues>({
    resolver: zodResolver(getGeneratePayrollSchema()),
    defaultValues: {
      userId: '',
      periodStart: firstDay,
      periodEnd: lastDay,
      baseSalary: 0,
      bonus: 0,
      deductions: 0,
    },
  });

  const watchedBase = Number(watch('baseSalary') || 0);
  const watchedBonus = Number(watch('bonus') || 0);
  const watchedDeductions = Number(watch('deductions') || 0);
  const estimatedTotal = Math.max(0, watchedBase + watchedBonus - watchedDeductions);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">بيانات مسير راتب الموظف</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              اختيار الموظف *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <select
                {...register('userId')}
                disabled={isLoadingUsers}
                className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">اختر الموظف من القائمة...</option>
                {staff.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role}) - {u.phone}
                  </option>
                ))}
              </select>
            </div>
            {errors.userId?.message && (
              <p className="text-[11px] text-rose-500 mt-1">{String(errors.userId.message)}</p>
            )}
          </div>

          {/* Period Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                type="date"
                label="بداية فترة المسير *"
                error={errors.periodStart?.message ? String(errors.periodStart.message) : undefined}
                {...register('periodStart')}
                leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div>
              <Input
                type="date"
                label="نهاية فترة المسير *"
                error={errors.periodEnd?.message ? String(errors.periodEnd.message) : undefined}
                {...register('periodEnd')}
                leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>

          {/* Salary Breakdown Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <Input
                type="number"
                step="any"
                label="الراتب الأساسي (ج.م) *"
                placeholder="0.00"
                error={errors.baseSalary?.message ? String(errors.baseSalary.message) : undefined}
                {...register('baseSalary', { valueAsNumber: true })}
                leftIcon={<Coins className="w-4 h-4 text-sky-600" />}
              />
            </div>

            <div>
              <Input
                type="number"
                step="any"
                label="المكافآت والحوافز (ج.م)"
                placeholder="0.00"
                error={errors.bonus?.message ? String(errors.bonus.message) : undefined}
                {...register('bonus', { valueAsNumber: true })}
                leftIcon={<ArrowUpRight className="w-4 h-4 text-emerald-600" />}
              />
            </div>

            <div>
              <Input
                type="number"
                step="any"
                label="الاستقطاعات والخصومات (ج.م)"
                placeholder="0.00"
                error={errors.deductions?.message ? String(errors.deductions.message) : undefined}
                {...register('deductions', { valueAsNumber: true })}
                leftIcon={<ArrowDownRight className="w-4 h-4 text-rose-500" />}
              />
            </div>
          </div>

          {/* Calculation Preview Banner */}
          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 flex items-center justify-between">
            <div>
              <p className="font-bold text-sky-900 dark:text-sky-200">الصافي التقديري المبدئي</p>
              <p className="text-[10px] text-sky-700 dark:text-sky-300">
                سيقوم النظام تلقائياً باحتساب وإضافة العمولات البيعية المستحقة للموظف خلال الفترة المحددة
              </p>
            </div>
            <div className="text-lg font-black font-mono text-sky-700 dark:text-sky-300">
              {estimatedTotal.toLocaleString()} {t('common.currency')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to="/payroll">
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
          توليد وحساب المسير
        </Button>
      </div>
    </form>
  );
};
