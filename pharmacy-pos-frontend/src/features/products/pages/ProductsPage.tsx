import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts, useDeleteProduct } from '../hooks/useProducts.js';
import { ProductTable } from '../components/ProductTable.js';
import { ProductFilters } from '../components/ProductFilters.js';
import { Button } from '../../../components/ui/Button.js';
import { Plus, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { Product } from '../types/product.types.js';

export const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState('');

  const { data, isLoading } = useProducts({
    page,
    limit: 15,
    search: search || undefined,
    categoryId: categoryId || undefined,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
  });

  const deleteMutation = useDeleteProduct();

  const handleDelete = async (product: Product) => {
    const confirmMsg = t('products.confirmDeletePrompt', { name: product.name });
    if (window.confirm(confirmMsg)) {
      await deleteMutation.mutateAsync(product.id);
    }
  };

  const handleReset = () => {
    setSearch('');
    setCategoryId('');
    setIsActive('');
    setPage(1);
  };

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Pill className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('products.pageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('products.pageSubtitle')}
          </p>
        </div>

        {canCreate && (
          <Link to="/products/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              {t('products.addProduct')}
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <ProductFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setPage(1);
        }}
        isActive={isActive}
        onActiveChange={(val) => {
          setIsActive(val);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Products Table */}
      <ProductTable
        products={data?.items || []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        onDelete={handleDelete}
      />
    </div>
  );
};
