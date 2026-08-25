import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSuppliers } from '../../suppliers/hooks/useSuppliers.js';
import { Supplier } from '../../suppliers/types/supplier.types.js';
import { Truck } from 'lucide-react';

export interface SupplierSelectProps {
  value: string;
  onChange: (supplierId: string, supplierName: string) => void;
  error?: string;
}

export const SupplierSelect: React.FC<SupplierSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const { t } = useTranslation();
  const { data, isLoading } = useSuppliers({ limit: 100, isActive: true });
  const suppliers = data?.items || [];

  return (
    <div className="space-y-1.5 text-start">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
        {t('purchases.fieldSupplier')} <span className="text-rose-500">*</span>
      </label>
      <div className="relative rounded-2xl">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
          <Truck className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => {
            const id = e.target.value;
            const found = suppliers.find((s: Supplier) => s.id === id);
            onChange(id, found?.name || '');
          }}
          className="block w-full rounded-2xl border py-2.5 ps-10 pe-4 text-sm transition-all bg-white border-slate-200 text-slate-900 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
        >
          <option value="">
            {isLoading ? t('common.loading') : t('purchases.selectSupplierPlaceholder')}
          </option>
          {suppliers.map((s: Supplier) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.phone})
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
};
