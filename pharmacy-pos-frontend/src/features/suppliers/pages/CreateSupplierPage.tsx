import React from 'react';
import { useTranslation } from 'react-i18next';
import { SupplierForm } from '../components/SupplierForm.js';
import { useCreateSupplier } from '../hooks/useSuppliers.js';
import { SupplierSchemaFormValues } from '../schemas/supplierSchemas.js';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const CreateSupplierPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateSupplier();

  const handleSubmit = async (values: SupplierSchemaFormValues) => {
    await createMutation.mutateAsync(values);
    navigate('/suppliers');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('suppliers.createTitle')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('suppliers.createSubtitle')}
        </p>
      </div>

      {/* Form */}
      <SupplierForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitLabel={t('suppliers.createSubmit')}
      />
    </div>
  );
};
