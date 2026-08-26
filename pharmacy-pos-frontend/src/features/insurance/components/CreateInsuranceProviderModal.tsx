import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createInsuranceProviderSchema,
  CreateInsuranceProviderFormData,
} from '../schemas/insuranceSchemas.js';
import { useCreateInsuranceProvider } from '../hooks/useInsurance.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { ShieldPlus, Percent, Phone, Mail, MapPin, FileText, AlertCircle } from 'lucide-react';

export interface CreateInsuranceProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInsuranceProviderModal: React.FC<CreateInsuranceProviderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createMutation = useCreateInsuranceProvider();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInsuranceProviderFormData>({
    resolver: zodResolver(createInsuranceProviderSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      defaultCoveragePercentage: 80,
      notes: '',
    },
  });

  const onSubmit = (data: CreateInsuranceProviderFormData) => {
    setErrorMessage(null);
    createMutation.mutate(
      {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        defaultCoveragePercentage: Number(data.defaultCoveragePercentage),
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message || 'فشل تسجيل شركة التأمين، يرجى التحقق من البيانات'
          );
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setErrorMessage(null);
        onClose();
      }}
      title="تسجيل شركة تأمين / جهة تعاقد جديدة"
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
            placeholder="مثال: شركة مصر للتأمين، أكسا، بوبا"
            error={errors.name?.message}
            leftIcon={<ShieldPlus className="w-4 h-4 text-slate-400" />}
            {...register('name')}
          />

          <Input
            label="نسبة التغطية الافتراضية (%) *"
            placeholder="80"
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
            label="رقم الهاتف / الخط الساخن للمطالبات"
            placeholder="+201000000000"
            error={errors.phone?.message}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            {...register('phone')}
          />

          <Input
            label="البريد الإلكتروني لإرسال المطالبات"
            placeholder="claims@insurance.com"
            type="email"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            {...register('email')}
          />
        </div>

        <Input
          label="العنوان الجغرافي للجهة"
          placeholder="مثال: القاهرة - المهندسين، فرع الموافقات والمطالبات"
          error={errors.address?.message}
          leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          {...register('address')}
        />

        <Input
          label="ملاحظات وشروط التعاقد الخاصة"
          placeholder="مثال: تتطلب أدوية الأمراض المزمنة موافقة مسبقة، استبعاد المكملات الغذائية"
          error={errors.notes?.message}
          leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
          {...register('notes')}
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
            isLoading={createMutation.isPending}
            leftIcon={<ShieldPlus className="w-4 h-4" />}
          >
            إضافة جهة التأمين
          </Button>
        </div>
      </form>
    </Modal>
  );
};
