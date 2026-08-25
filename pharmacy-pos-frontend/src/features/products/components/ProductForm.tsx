import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getProductSchema, ProductFormValues } from '../schemas/productSchemas.js';
import { useCategories } from '../../categories/hooks/useCategories.js';
import { Category } from '../../categories/types/category.types.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { Pill, Barcode, DollarSign, Boxes, FileText, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = categoriesData?.items || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(getProductSchema()),
    defaultValues: {
      name: initialValues?.name || '',
      barcode: initialValues?.barcode || '',
      scientificName: initialValues?.scientificName || '',
      description: initialValues?.description || '',
      categoryId: initialValues?.categoryId || '',
      purchasePrice: initialValues?.purchasePrice ?? 0,
      sellingPrice: initialValues?.sellingPrice ?? 0,
      taxRate: initialValues?.taxRate ?? 0,
      minimumStock: initialValues?.minimumStock ?? 5,
      isActive: initialValues?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-3xl shadow-xs">
        <CardContent className="p-6 space-y-5">
          {/* Section 1: Basic Medicine Info */}
          <div className="border-b border-slate-100 dark:border-[#1E293B] pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {t('products.basicInfoTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('products.basicInfoSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Commercial Name */}
            <Input
              label={t('products.fieldName')}
              placeholder={t('products.fieldNamePlaceholder')}
              leftIcon={<Pill className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Barcode */}
            <Input
              label={t('products.fieldBarcode')}
              placeholder={t('products.fieldBarcodePlaceholder')}
              leftIcon={<Barcode className="w-4 h-4" />}
              error={errors.barcode?.message}
              {...register('barcode')}
            />

            {/* Scientific Name (Active Ingredient) */}
            <Input
              label={t('products.fieldScientificName')}
              placeholder={t('products.fieldScientificNamePlaceholder')}
              leftIcon={<FileText className="w-4 h-4" />}
              error={errors.scientificName?.message}
              {...register('scientificName')}
            />

            {/* Category Select */}
            <div className="space-y-1.5 text-start">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {t('products.fieldCategory')}
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <select
                  className="block w-full rounded-2xl border py-2.5 ps-10 pe-4 text-sm transition-all bg-white border-slate-200 text-slate-900 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                  {...register('categoryId')}
                >
                  <option value="">{isLoadingCategories ? t('common.loading') : t('products.selectCategory')}</option>
                  {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoryId && (
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-start">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {t('products.fieldDescription')}
            </label>
            <textarea
              rows={3}
              placeholder={t('products.fieldDescriptionPlaceholder')}
              className="block w-full rounded-2xl border p-3.5 text-sm transition-all bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
              {...register('description')}
            />
          </div>

          {/* Section 2: Pricing & Stock Limits */}
          <div className="border-b border-slate-100 dark:border-[#1E293B] pt-3 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {t('products.pricingAndStockTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('products.pricingAndStockSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Purchase Price */}
            <Input
              label={t('products.fieldPurchasePrice')}
              type="number"
              step="0.01"
              leftIcon={<DollarSign className="w-4 h-4" />}
              error={errors.purchasePrice?.message}
              {...register('purchasePrice')}
            />

            {/* Selling Price */}
            <Input
              label={t('products.fieldSellingPrice')}
              type="number"
              step="0.01"
              leftIcon={<DollarSign className="w-4 h-4" />}
              error={errors.sellingPrice?.message}
              {...register('sellingPrice')}
            />

            {/* Minimum Stock Alert Level */}
            <Input
              label={t('products.fieldMinimumStock')}
              type="number"
              step="1"
              leftIcon={<Boxes className="w-4 h-4" />}
              error={errors.minimumStock?.message}
              {...register('minimumStock')}
            />

            {/* Tax Rate */}
            <Input
              label={t('products.fieldTaxRate')}
              type="number"
              step="0.1"
              placeholder="0%"
              error={errors.taxRate?.message}
              {...register('taxRate')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/products')}
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
