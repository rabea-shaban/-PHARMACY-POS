import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../categories/hooks/useCategories.js';
import { Search, X } from 'lucide-react';
import { Category } from '../../categories/types/category.types.js';
import { Input } from '../../../components/ui/Input.js';

export interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  categoryId: string;
  onCategoryChange: (val: string) => void;
  isActive: string;
  onActiveChange: (val: string) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  isActive,
  onActiveChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.items || [];

  const hasActiveFilters = search || categoryId || isActive;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs">
      {/* Search Input */}
      <div className="flex-1">
        <Input
          placeholder={t('products.searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Category Dropdown */}
      <div className="w-full sm:w-48">
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">{t('products.allCategories')}</option>
          {categories.map((c: Category) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Dropdown */}
      <div className="w-full sm:w-36">
        <select
          value={isActive}
          onChange={(e) => onActiveChange(e.target.value)}
          className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">{t('products.allStatuses')}</option>
          <option value="true">{t('products.statusActive')}</option>
          <option value="false">{t('products.statusInactive')}</option>
        </select>
      </div>

      {/* Clear Filters button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
          title={t('common.clearFilters')}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
