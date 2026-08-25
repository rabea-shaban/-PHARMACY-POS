import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useSupplier, useSupplierPurchases } from '../hooks/useSuppliers.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { SupplierStatusBadge } from '../components/SupplierStatusBadge.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Truck, Edit3, Phone, Mail, MapPin, Receipt, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const SupplierDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const { data: supplier, isLoading, isError } = useSupplier(id);
  const { data: purchasesData, isLoading: isLoadingPurchases } = useSupplierPurchases(id);

  const purchases = purchasesData?.items || [];
  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);
  const canCreatePurchase = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

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
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/suppliers"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {supplier.name}
              </h1>
              <SupplierStatusBadge isActive={supplier.isActive} />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {t('suppliers.supplierSince')}: {formatDate(supplier.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {canCreatePurchase && (
            <Link to={`/purchases/new?supplierId=${supplier.id}`}>
              <Button variant="primary" size="md" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                {t('purchases.createPurchase')}
              </Button>
            </Link>
          )}

          {canEdit && (
            <Link to={`/suppliers/${supplier.id}/edit`}>
              <Button variant="outline" size="md" leftIcon={<Edit3 className="w-4 h-4" />}>
                {t('common.edit')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Info Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Contact & Tax Information */}
        <div className="space-y-6">
          <Card className="rounded-3xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t('suppliers.contactInfoTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">{t('suppliers.fieldPhone')}</p>
                  <p className="font-bold font-mono">{supplier.phone}</p>
                </div>
              </div>

              {supplier.email && (
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">{t('suppliers.fieldEmail')}</p>
                    <p className="font-bold truncate max-w-xs">{supplier.email}</p>
                  </div>
                </div>
              )}

              {supplier.address && (
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">{t('suppliers.fieldAddress')}</p>
                    <p className="font-bold">{supplier.address}</p>
                  </div>
                </div>
              )}

              {supplier.taxNumber && (
                <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
                  <p className="text-[11px] text-slate-400">{t('suppliers.fieldTaxNumber')}</p>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{supplier.taxNumber}</p>
                </div>
              )}

              {supplier.notes && (
                <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
                  <p className="text-[11px] text-slate-400">{t('suppliers.fieldNotes')}</p>
                  <p className="text-slate-600 dark:text-slate-300 italic">{supplier.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Invoices & Purchase History */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">{t('suppliers.purchaseHistoryTitle')}</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('suppliers.purchaseHistorySubtitle')}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {isLoadingPurchases ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : purchases.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title={t('suppliers.noPurchasesYet')}
                  description={t('suppliers.noPurchasesYetDesc')}
                />
              ) : (
                <div className="space-y-2.5">
                  {purchases.map((purchase: any) => (
                    <Link
                      key={purchase.id}
                      to={`/purchases/${purchase.id}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#0B0F17]/60 border border-slate-100 dark:border-[#1E293B] hover:border-sky-200 dark:hover:border-[#2A3B56] transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 flex items-center justify-center font-bold shrink-0">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {purchase.invoiceNumber}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {formatDate(purchase.purchaseDate || purchase.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-end">
                        <p className="font-black text-sky-600 dark:text-sky-400">
                          {formatCurrency(purchase.total)}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300">
                          {purchase.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
