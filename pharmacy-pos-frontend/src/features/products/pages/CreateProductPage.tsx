import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductForm } from '../components/ProductForm.js';
import { useCreateProduct } from '../hooks/useProducts.js';
import { ProductFormValues } from '../schemas/productSchemas.js';
import { useNavigate } from 'react-router-dom';
import { Pill } from 'lucide-react';

export const CreateProductPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    await createMutation.mutateAsync(values);
    navigate('/products');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Pill className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('products.createTitle')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('products.createSubtitle')}
        </p>
      </div>

      {/* Form */}
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitLabel={t('products.createSubmit')}
      />
    </div>
  );
};
