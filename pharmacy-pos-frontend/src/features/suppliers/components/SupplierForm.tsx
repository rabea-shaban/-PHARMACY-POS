import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getSupplierSchema, SupplierSchemaFormValues } from '../schemas/supplierSchemas.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { Building2, Phone, Mail, MapPin, ReceiptText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SupplierFormProps {
  initialValues?: Partial<SupplierSchemaFormValues>;
  onSubmit: (values: SupplierSchemaFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierSchemaFormValues>({
    resolver: zodResolver(getSupplierSchema()),
    defaultValues: {
      name: initialValues?.name || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      address: initialValues?.address || '',
      taxNumber: initialValues?.taxNumber || '',
      notes: initialValues?.notes || '',
      isActive: initialValues?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-3xl shadow-xs">
        <CardContent className="p-6 space-y-5">
          {/* Section 1: Basic Company / Supplier Info */}
          <div className="border-b border-slate-100 dark:border-[#1E293B] pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {t('suppliers.basicInfoTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('suppliers.basicInfoSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier Name */}
            <Input
              label={t('suppliers.fieldName')}
              placeholder={t('suppliers.fieldNamePlaceholder')}
              leftIcon={<Building2 className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Phone */}
            <Input
              label={t('suppliers.fieldPhone')}
              placeholder={t('suppliers.fieldPhonePlaceholder')}
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Email */}
            <Input
              label={t('suppliers.fieldEmail')}
              type="email"
              placeholder={t('suppliers.fieldEmailPlaceholder')}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Tax Number */}
            <Input
              label={t('suppliers.fieldTaxNumber')}
              placeholder={t('suppliers.fieldTaxNumberPlaceholder')}
              leftIcon={<ReceiptText className="w-4 h-4" />}
              error={errors.taxNumber?.message}
              {...register('taxNumber')}
            />
          </div>

          {/* Address */}
          <Input
            label={t('suppliers.fieldAddress')}
            placeholder={t('suppliers.fieldAddressPlaceholder')}
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.address?.message}
            {...register('address')}
          />

          {/* Notes */}
          <div className="space-y-1.5 text-start">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {t('suppliers.fieldNotes')}
            </label>
            <textarea
              rows={3}
              placeholder={t('suppliers.fieldNotesPlaceholder')}
              className="block w-full rounded-2xl border p-3.5 text-sm transition-all bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
              {...register('notes')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/suppliers')}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          {submitLabel || t('common.save')}
        </Button>
      </div>
    </form>
  );
};
