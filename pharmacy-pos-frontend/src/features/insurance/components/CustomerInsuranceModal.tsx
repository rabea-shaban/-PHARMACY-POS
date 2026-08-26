import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCustomerInsuranceSchema,
  CreateCustomerInsuranceFormData,
} from '../schemas/insuranceSchemas.js';
import { useCreateCustomerInsurance, useInsuranceProviders } from '../hooks/useInsurance.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import {
  ShieldCheck,
  CreditCard,
  Hash,
  Percent,
  Coins,
  Calendar,
  AlertCircle,
  Building2,
} from 'lucide-react';

export interface CustomerInsuranceModalProps {
  customerId: string;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerInsuranceModal: React.FC<CustomerInsuranceModalProps> = ({
  customerId,
  customerName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: providersData, isLoading: isLoadingProviders } = useInsuranceProviders({
    isActive: true,
    limit: 100,
  });

  const createPolicyMutation = useCreateCustomerInsurance();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCustomerInsuranceFormData>({
    resolver: zodResolver(createCustomerInsuranceSchema),
    defaultValues: {
      customerId,
      insuranceProviderId: '',
      policyNumber: '',
      memberNumber: '',
      coveragePercentage: 80,
      maxCoverageLimit: null,
      expiryDate: '',
    },
  });

  const selectedProviderId = watch('insuranceProviderId');

  // Handle auto-filling default coverage percentage from chosen provider
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setValue('insuranceProviderId', pId, { shouldValidate: true });
    const provider = providersData?.items.find((p) => p.id === pId);
    if (provider) {
      setValue('coveragePercentage', provider.defaultCoveragePercentage, { shouldValidate: true });
    }
  };

  const onSubmit = (data: CreateCustomerInsuranceFormData) => {
    setErrorMessage(null);

    createPolicyMutation.mutate(
      {
        customerId,
        insuranceProviderId: data.insuranceProviderId,
        policyNumber: data.policyNumber.trim(),
        memberNumber: data.memberNumber.trim(),
        coveragePercentage: data.coveragePercentage ? Number(data.coveragePercentage) : undefined,
        maxCoverageLimit: data.maxCoverageLimit ? Number(data.maxCoverageLimit) : null,
        expiryDate: data.expiryDate ? data.expiryDate : null,
      },
      {
        onSuccess: () => {
          reset();
          if (onSuccess) onSuccess();
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message || 'فشل ربط بوليصة التأمين بالعميل'
          );
        },
      }
    );
  };

  const providers = providersData?.items || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setErrorMessage(null);
        onClose();
      }}
      title={`ربط بوليصة تأمين صحي للعميل: ${customerName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Provider Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>شركة التأمين / جهة التعاقد *</span>
          </label>
          <select
            value={selectedProviderId}
            onChange={handleProviderChange}
            disabled={isLoadingProviders}
            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
          >
            <option value="">-- اختر شركة التأمين أو جهة التعاقد --</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.defaultCoveragePercentage}% تغطية قياسية)
              </option>
            ))}
          </select>
          {errors.insuranceProviderId && (
            <p className="text-[11px] font-bold text-rose-600 mt-1">
              {errors.insuranceProviderId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="رقم بوليصة التأمين (Policy Number) *"
            placeholder="مثال: POL-2026-9812"
            error={errors.policyNumber?.message}
            leftIcon={<CreditCard className="w-4 h-4 text-slate-400" />}
            {...register('policyNumber')}
          />

          <Input
            label="رقم العضوية / الكارنيه (Member ID) *"
            placeholder="مثال: MEM-104928"
            error={errors.memberNumber?.message}
            leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
            {...register('memberNumber')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="نسبة التغطية التأمينية المعتمدة (%) *"
            placeholder="80"
            type="number"
            min="0"
            max="100"
            error={errors.coveragePercentage?.message}
            leftIcon={<Percent className="w-4 h-4 text-slate-400" />}
            {...register('coveragePercentage')}
          />

          <Input
            label="الحد الأقصى للتغطية (ج.م) [اختياري]"
            placeholder="مثال: 5000 (اتركه فارغاً إذا كان بدون حد)"
            type="number"
            min="0"
            step="0.01"
            error={errors.maxCoverageLimit?.message}
            leftIcon={<Coins className="w-4 h-4 text-slate-400" />}
            {...register('maxCoverageLimit')}
          />
        </div>

        <Input
          label="تاريخ انتهاء صلاحية الكارنيه / البوليصة"
          type="date"
          error={errors.expiryDate?.message}
          leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          {...register('expiryDate')}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            إلغاء
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={createPolicyMutation.isPending}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            تفعيل وربط البوليصة
          </Button>
        </div>
      </form>
    </Modal>
  );
};
