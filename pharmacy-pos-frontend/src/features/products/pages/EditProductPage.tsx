import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../hooks/useProducts.js';
import { ProductForm } from '../components/ProductForm.js';
import { ProductFormValues } from '../schemas/productSchemas.js';
import { Pill } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState.js';

export const EditProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProduct(id);
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    await updateMutation.mutateAsync({ id, data: values });
    navigate('/products');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-96 w-full bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={Pill}
        title={t('products.notFoundTitle')}
        description={t('products.notFoundDesc')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Pill className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('products.editTitle')}: {product.name}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('products.editSubtitle')}
        </p>
      </div>

      {/* Form with populated initial values */}
      <ProductForm
        initialValues={{
          name: product.name,
          barcode: product.barcode || '',
          scientificName: product.scientificName,
          description: product.description,
          categoryId: product.categoryId,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          taxRate: product.taxRate,
          minimumStock: product.minimumStock,
          isActive: product.isActive,
        }}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel={t('products.editSubmit')}
      />
    </div>
  );
};
