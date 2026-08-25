import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StockSummaryCards } from '../components/StockSummaryCards.js';
import { useProducts } from '../../products/hooks/useProducts.js';
import { ProductTable } from '../../products/components/ProductTable.js';
import { ProductFilters } from '../../products/components/ProductFilters.js';
import { Boxes, Layers, AlertTriangle, Clock, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.js';

export const InventoryPage: React.FC = () => {
  const { t } = useTranslation();
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('inventory.pageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.pageSubtitle')}
          </p>
        </div>

        {/* Quick Tabs to FEFO, Low Stock, Expiry, Ledger */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/inventory/batches">
            <Button variant="outline" size="sm" leftIcon={<Layers className="w-3.5 h-3.5" />}>
              {t('inventory.navBatches')}
            </Button>
          </Link>
          <Link to="/inventory/low-stock">
            <Button variant="outline" size="sm" leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
              {t('inventory.navLowStock')}
            </Button>
          </Link>
          <Link to="/inventory/expiry">
            <Button variant="outline" size="sm" leftIcon={<Clock className="w-3.5 h-3.5" />}>
              {t('inventory.navExpiry')}
            </Button>
          </Link>
          <Link to="/inventory/transactions">
            <Button variant="outline" size="sm" leftIcon={<History className="w-3.5 h-3.5" />}>
              {t('inventory.navTransactions')}
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Live Inventory Health KPI Cards */}
      <StockSummaryCards />

      {/* 2. Filters */}
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
        onReset={() => {
          setSearch('');
          setCategoryId('');
          setIsActive('');
          setPage(1);
        }}
      />

      {/* 3. Product Inventory Table */}
      <ProductTable
        products={data?.items || []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
      />
    </div>
  );
};
