import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuppliers, useDeleteSupplier } from '../hooks/useSuppliers.js';
import { SupplierTable } from '../components/SupplierTable.js';
import { SupplierFilters } from '../components/SupplierFilters.js';
import { Button } from '../../../components/ui/Button.js';
import { showConfirmDialog } from '../../../lib/alerts.js';
import { Plus, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { Supplier } from '../types/supplier.types.js';

export const SuppliersPage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('');

  const { data, isLoading } = useSuppliers({
    page,
    limit: 15,
    search: search || undefined,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
  });

  const deleteMutation = useDeleteSupplier();

  const handleDelete = async (supplier: Supplier) => {
    const confirmed = await showConfirmDialog({
      title: t('suppliers.deleteSupplier') || 'حذف المورد',
      text: t('suppliers.confirmDeletePrompt', { name: supplier.name }) || `هل أنت متأكد من رغبتك في حذف بيانات المورد (${supplier.name})؟`,
      confirmButtonText: 'نعم، حذف',
      cancelButtonText: 'إلغاء',
      isDanger: true,
    });
    if (confirmed) {
      await deleteMutation.mutateAsync(supplier.id);
    }
  };

  const handleReset = () => {
    setSearch('');
    setIsActive('');
    setPage(1);
  };

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('suppliers.pageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('suppliers.pageSubtitle')}
          </p>
        </div>

        {canCreate && (
          <Link to="/suppliers/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              {t('suppliers.addSupplier')}
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <SupplierFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isActive={isActive}
        onActiveChange={(val) => {
          setIsActive(val);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Suppliers Table */}
      <SupplierTable
        suppliers={data?.items || []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        onDelete={handleDelete}
      />
    </div>
  );
};
