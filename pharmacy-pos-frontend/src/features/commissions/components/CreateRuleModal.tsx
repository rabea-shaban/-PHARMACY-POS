import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getCreateCommissionRuleSchema,
  CreateCommissionRuleFormValues,
} from '../schemas/commissionSchemas.js';
import { useCreateCommissionRule } from '../hooks/useCommissions.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Percent, Coins, Calendar, Sparkles, AlertCircle } from 'lucide-react';

export interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRuleModal: React.FC<CreateRuleModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateCommissionRule();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommissionRuleFormValues>({
    resolver: zodResolver(getCreateCommissionRuleSchema()),
    defaultValues: {
      name: '',
      percentage: 2.5,
      fixedAmount: undefined,
      effectiveDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: CreateCommissionRuleFormValues) => {
    setErrorMessage(null);
    try {
      await createMutation.mutateAsync({
        name: values.name,
        percentage: Number(values.percentage),
        fixedAmount: values.fixedAmount ? Number(values.fixedAmount) : null,
        effectiveDate: values.effectiveDate || undefined,
      });
      reset();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة قاعدة عمولة جديدة">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <Input
            label="اسم قاعدة العمولة *"
            placeholder="مثال: عمولة مبيعات الأدوية الأساسية 2.5%"
            error={errors.name?.message ? String(errors.name.message) : undefined}
            {...register('name')}
            leftIcon={<Sparkles className="w-4 h-4 text-sky-600" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              type="number"
              step="any"
              label="نسبة العمولة المئوية (%) *"
              placeholder="2.5"
              error={errors.percentage?.message ? String(errors.percentage.message) : undefined}
              {...register('percentage', { valueAsNumber: true })}
              leftIcon={<Percent className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div>
            <Input
              type="number"
              step="any"
              label="مبلغ ثابت إضافي (اختياري)"
              placeholder="0.00"
              error={errors.fixedAmount?.message ? String(errors.fixedAmount.message) : undefined}
              {...register('fixedAmount', { valueAsNumber: true })}
              leftIcon={<Coins className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        <div>
          <Input
            type="date"
            label="تاريخ بدء سريان القاعدة"
            error={errors.effectiveDate?.message ? String(errors.effectiveDate.message) : undefined}
            {...register('effectiveDate')}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={createMutation.isPending}
          >
            حفظ وتفعيل القاعدة
          </Button>
        </div>
      </form>
    </Modal>
  );
};
