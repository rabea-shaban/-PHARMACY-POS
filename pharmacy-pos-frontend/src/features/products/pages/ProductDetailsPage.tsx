import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useProductBatches } from '../hooks/useProducts.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { ProductStatusBadge } from '../components/ProductStatusBadge.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Pill, Edit3, Boxes, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const ProductDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: batches, isLoading: isLoadingBatches } = useProductBatches(id);

  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
          <div className="md:col-span-2 h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
        </div>
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
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {product.name}
              </h1>
              <ProductStatusBadge
                currentStock={product.currentStock}
                minimumStock={product.minimumStock}
                isActive={product.isActive}
              />
            </div>
            {product.scientificName && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {product.scientificName}
              </p>
            )}
          </div>
        </div>

        {canEdit && (
          <Link to={`/products/${product.id}/edit`}>
            <Button variant="primary" size="md" leftIcon={<Edit3 className="w-4 h-4" />}>
              {t('common.edit')}
            </Button>
          </Link>
        )}
      </div>

      {/* Info Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Stock & Pricing Summary */}
        <div className="space-y-6">
          <Card className="rounded-3xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t('products.pricingSummaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500">{t('products.colSellingPrice')}:</span>
                <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500">{t('products.colPurchasePrice')}:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(product.purchasePrice)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500">{t('products.fieldTaxRate')}:</span>
                <span className="font-bold">{product.taxRate}%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">{t('products.currentStockLabel')}:</span>
                <span className="font-black text-base text-slate-900 dark:text-white">
                  {product.currentStock} {t('dashboard.unitsUnit')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t('products.specificationsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500">{t('products.colBarcode')}:</span>
                <span className="font-mono font-bold">{product.barcode || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500">{t('products.colCategory')}:</span>
                <span className="font-bold">{product.category?.name || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500">{t('dashboard.minThreshold')}:</span>
                <span className="font-bold">{product.minimumStock}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">{t('products.createdDate')}:</span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Batches & FEFO Allocation */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">{t('products.activeBatchesTitle')}</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('products.activeBatchesSubtitle')}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {isLoadingBatches ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : !batches || batches.length === 0 ? (
                <EmptyState
                  icon={Boxes}
                  title={t('products.noBatches')}
                  description={t('products.noBatchesDesc')}
                />
              ) : (
                <div className="space-y-2.5">
                  {batches.map((batch, index) => {
                    const exp = new Date(batch.expiryDate);
                    const today = new Date();
                    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isNear = diffDays <= 30 && diffDays > 0;
                    const isExpired = diffDays <= 0;

                    return (
                      <div
                        key={batch.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs ${
                          isExpired
                            ? 'bg-rose-50/50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-200'
                            : isNear
                            ? 'bg-amber-50/50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-200'
                            : 'bg-slate-50/60 border-slate-100 text-slate-800 dark:bg-[#0B0F17]/60 dark:border-[#1E293B] dark:text-slate-100'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs">
                              {batch.batchNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/30 text-[10px] font-bold">
                              FEFO #{index + 1}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {t('products.expiryDate')}: {formatDate(batch.expiryDate)} (
                            {isExpired
                              ? t('products.batchExpired')
                              : `${diffDays} ${t('dashboard.daysLeft')}`}
                            )
                          </p>
                        </div>

                        <div className="text-end">
                          <span className="font-black text-sm">
                            {batch.quantity} {t('dashboard.unitsUnit')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
