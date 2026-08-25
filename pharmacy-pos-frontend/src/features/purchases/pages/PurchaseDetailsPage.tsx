import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { usePurchase, useCancelPurchase } from '../hooks/usePurchases.js';
import { PurchaseStatusBadge } from '../components/PurchaseStatusBadge.js';
import { ReceivePurchaseModal } from '../components/ReceivePurchaseModal.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { ShoppingBag, PackageCheck, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const PurchaseDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const { data: purchase, isLoading, isError } = usePurchase(id);
  const cancelMutation = useCancelPurchase();

  const canReceive = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);
  const canCancel = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const handleCancel = async () => {
    const reason = window.prompt(t('purchases.cancelPromptReason'));
    if (reason && reason.trim().length >= 3) {
      await cancelMutation.mutateAsync({ id, reason: reason.trim() });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !purchase) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t('purchases.notFoundTitle')}
        description={t('purchases.notFoundDesc')}
      />
    );
  }

  const isPending = purchase.status === 'PENDING';

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/purchases"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {t('purchases.invoiceNumberTitle')}: {purchase.invoiceNumber}
              </h1>
              <PurchaseStatusBadge status={purchase.status} />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {formatDate(purchase.purchaseDate || purchase.createdAt)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          {isPending && canReceive && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<PackageCheck className="w-4 h-4" />}
              onClick={() => setIsReceiveModalOpen(true)}
            >
              {t('purchases.receiveGoods')}
            </Button>
          )}

          {isPending && canCancel && (
            <Button
              variant="danger"
              size="md"
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={handleCancel}
              isLoading={cancelMutation.isPending}
            >
              {t('purchases.cancelPurchase')}
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Details Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">{t('suppliers.colSupplier')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {purchase.supplier?.name || purchase.supplierName || '—'}
            </p>
            {purchase.supplier?.phone && (
              <p className="text-slate-500">{purchase.supplier.phone}</p>
            )}
            {purchase.supplier?.address && (
              <p className="text-slate-400">{purchase.supplier.address}</p>
            )}
            {purchase.supplierId && (
              <Link
                to={`/suppliers/${purchase.supplierId}`}
                className="inline-block text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1"
              >
                {t('suppliers.viewProfile')}
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">{t('purchases.financialDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">{t('pos.subtotal')}:</span>
              <span className="font-bold">{formatCurrency(purchase.subtotal)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">{t('pos.discount')}:</span>
              <span className="font-bold text-rose-600">-{formatCurrency(purchase.discount)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">{t('products.fieldTaxRate')}:</span>
              <span className="font-bold">+{formatCurrency(purchase.tax)}</span>
            </div>
            <div className="flex justify-between py-1 border-t border-slate-100 dark:border-[#1E293B]">
              <span className="font-black text-slate-900 dark:text-white">{t('pos.grandTotal')}:</span>
              <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
                {formatCurrency(purchase.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">{t('purchases.invoiceStatusTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">{t('common.status')}:</span>
              <PurchaseStatusBadge status={purchase.status} />
            </div>
            {purchase.user?.name && (
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">{t('inventory.colStaff')}:</span>
                <span className="font-bold">{purchase.user.name}</span>
              </div>
            )}
            {purchase.notes && (
              <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
                <p className="text-[11px] text-slate-400">{t('purchases.invoiceNotes')}</p>
                <p className="text-slate-600 dark:text-slate-300 italic">{purchase.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-base">{t('purchases.invoiceItems')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">{t('products.colProduct')}</th>
                  <th className="py-3.5 px-4 text-start">{t('purchases.colQuantity')}</th>
                  <th className="py-3.5 px-4 text-start">{t('purchases.colUnitCost')}</th>
                  <th className="py-3.5 px-4 text-start">{t('dashboard.batchNo')}</th>
                  <th className="py-3.5 px-4 text-start">{t('products.expiryDate')}</th>
                  <th className="py-3.5 px-4 text-end">{t('purchases.colTotal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {purchase.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.product?.name || item.productName || 'دواء'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {item.quantity} {t('dashboard.unitsUnit')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {formatCurrency(item.unitCost)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                      {item.batchNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.expiryDate ? formatDate(item.expiryDate) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-end font-black text-sky-600 dark:text-sky-400 text-sm">
                      {formatCurrency(item.total || (item.quantity * item.unitCost))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Receive Purchase Modal */}
      {isReceiveModalOpen && (
        <ReceivePurchaseModal
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          purchase={purchase}
        />
      )}
    </div>
  );
};
