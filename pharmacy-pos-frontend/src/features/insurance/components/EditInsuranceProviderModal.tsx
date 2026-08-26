import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateInsuranceProviderSchema,
  UpdateInsuranceProviderFormData,
} from '../schemas/insuranceSchemas.js';
import { useUpdateInsuranceProvider } from '../hooks/useInsurance.js';
import { InsuranceProvider } from '../types/insurance.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { ShieldCheck, Percent, Phone, Mail, MapPin, FileText, AlertCircle, Save } from 'lucide-react';

export interface EditInsuranceProviderModalProps {
  provider: InsuranceProvider | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditInsuranceProviderModal: React.FC<EditInsuranceProviderModalProps> = ({
  provider,
  isOpen,
  onClose,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateMutation = useUpdateInsuranceProvider();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateInsuranceProviderFormData>({
    resolver: zodResolver(updateInsuranceProviderSchema),
    defaultValues: {
      name: provider?.name || '',
      phone: provider?.phone || '',
      email: provider?.email || '',
      address: provider?.address || '',
      defaultCoveragePercentage: provider?.defaultCoveragePercentage || 80,
      notes: provider?.notes || '',
      isActive: provider?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (provider) {
      reset({
        name: provider.name,
        phone: provider.phone || '',
        email: provider.email || '',
        address: provider.address || '',
        defaultCoveragePercentage: provider.defaultCoveragePercentage,
        notes: provider.notes || '',
        isActive: provider.isActive,
      });
    }
  }, [provider, reset]);

  const onSubmit = (data: UpdateInsuranceProviderFormData) => {
    if (!provider) return;
    setErrorMessage(null);

    updateMutation.mutate(
      {
        id: provider.id,
        data: {
          name: data.name,
          phone: data.phone || null,
          email: data.email || null,
          address: data.address || null,
          defaultCoveragePercentage: Number(data.defaultCoveragePercentage),
          notes: data.notes || null,
          isActive: data.isActive,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || 'فشل تحديث بيانات شركة التأمين');
        },
      }
    );
  };

  if (!provider) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setErrorMessage(null);
        onClose();
      }}
      title={`تعديل بيانات تعاقد: ${provider.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="اسم شركة التأمين / التعاقد *"
            error={errors.name?.message}
            leftIcon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
            {...register('name')}
          />

          <Input
            label="نسبة التغطية الافتراضية (%) *"
            type="number"
            min="0"
            max="100"
            error={errors.defaultCoveragePercentage?.message}
            leftIcon={<Percent className="w-4 h-4 text-slate-400" />}
            {...register('defaultCoveragePercentage')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="رقم الهاتف / الخط الساخن"
            error={errors.phone?.message}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            {...register('phone')}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            {...register('email')}
          />
        </div>

        <Input
          label="العنوان الجغرافي"
          error={errors.address?.message}
          leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          {...register('address')}
        />

        <Input
          label="ملاحظات وشروط التعاقد"
          error={errors.notes?.message}
          leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
          {...register('notes')}
        />

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              حالة تعاقد شركة التأمين
            </span>
            <span className="text-[11px] text-slate-500">
              عند إيقاف التعاقد، لن يتاح اختيار هذه الشركة في فواتير ونقطة البيع (POS)
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...register('isActive')} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            إلغاء
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={updateMutation.isPending}
            leftIcon={<Save className="w-4 h-4" />}
          >
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </Modal>
  );
};
