import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupplier, useUpdateSupplier } from '../hooks/useSuppliers.js';
import { SupplierForm } from '../components/SupplierForm.js';
import { SupplierSchemaFormValues } from '../schemas/supplierSchemas.js';
import { Truck } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState.js';

export const EditSupplierPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: supplier, isLoading, isError } = useSupplier(id);
  const updateMutation = useUpdateSupplier();

  const handleSubmit = async (values: SupplierSchemaFormValues) => {
    await updateMutation.mutateAsync({ id, data: values });
    navigate('/suppliers');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-96 w-full bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <EmptyState
        icon={Truck}
        title={t('suppliers.notFoundTitle')}
        description={t('suppliers.notFoundDesc')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('suppliers.editTitle')}: {supplier.name}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('suppliers.editSubtitle')}
        </p>
      </div>

      {/* Form with prefilled initial values */}
      <SupplierForm
        initialValues={{
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email || '',
          address: supplier.address || '',
          taxNumber: supplier.taxNumber || '',
          notes: supplier.notes || '',
          isActive: supplier.isActive,
        }}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel={t('suppliers.editSubmit')}
      />
    </div>
  );
};
