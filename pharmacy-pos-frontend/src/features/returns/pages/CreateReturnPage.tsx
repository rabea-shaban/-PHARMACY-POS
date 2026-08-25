import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sale, SaleItem } from '../../sales/types/sale.types.js';
import { SaleReturn } from '../types/return.types.js';
import { useCreateSaleReturn } from '../hooks/useReturns.js';
import { SaleLookup } from '../components/SaleLookup.js';
import { ReturnItemsTable, SelectedReturnItem } from '../components/ReturnItemsTable.js';
import { ReturnReasonSelect } from '../components/ReturnReasonSelect.js';
import { RefundSummary } from '../components/RefundSummary.js';
import { RefundSuccessModal } from '../components/RefundSuccessModal.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { RotateCcw, AlertCircle, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils.js';

export const CreateReturnPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedReturnItem>>({});
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [completedReturn, setCompletedReturn] = useState<SaleReturn | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const createReturnMutation = useCreateSaleReturn();

  const handleSelectSale = (sale: Sale) => {
    setSelectedSale(sale);
    setSelectedItems({});
    setErrorMessage(null);
  };

  const handleToggleItem = (item: SaleItem) => {
    if (selectedItems[item.id]) {
      const copy = { ...selectedItems };
      delete copy[item.id];
      setSelectedItems(copy);
    } else {
      setSelectedItems({
        ...selectedItems,
        [item.id]: {
          saleItemId: item.id,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          originalQuantity: item.quantity,
          returnQuantity: 1,
          refundTotal: item.unitPrice * 1,
        },
      });
    }
  };

  const handleUpdateQuantity = (saleItemId: string, quantity: number) => {
    if (!selectedItems[saleItemId]) return;
    const current = selectedItems[saleItemId];
    const unitPrice = current.unitPrice;
    setSelectedItems({
      ...selectedItems,
      [saleItemId]: {
        ...current,
        returnQuantity: quantity,
        refundTotal: Number((unitPrice * quantity).toFixed(2)),
      },
    });
  };

  const selectedList = Object.values(selectedItems);
  const totalRefund = selectedList.reduce((acc, it) => acc + it.refundTotal, 0);

  const handleSubmitReturn = async () => {
    setErrorMessage(null);

    if (!selectedSale) {
      setErrorMessage('يرجى تحديد الفاتورة أولاً');
      return;
    }

    if (selectedList.length === 0) {
      setErrorMessage('يجب تحديد صنف واحد على الأقل للاسترجاع');
      return;
    }

    if (!reason) {
      setErrorMessage('يرجى اختيار سبب الاسترجاع');
      return;
    }

    try {
      const payload = {
        saleId: selectedSale.id,
        reason: reason || null,
        items: selectedList.map((it) => ({
          saleItemId: it.saleItemId,
          quantity: it.returnQuantity,
        })),
      };

      const result = await createReturnMutation.mutateAsync(payload);
      setCompletedReturn(result);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  const handleNewReturn = () => {
    setIsSuccessModalOpen(false);
    setCompletedReturn(null);
    setSelectedSale(null);
    setSelectedItems({});
    setReason('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <RotateCcw className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <span>إرجاع فاتورة بيع واسترداد مالي (Sales Reversal)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          البحث عن أصل الفاتورة، تحديد الأصناف والكميات المراد إرجاعها، وإعادة الأرصدة للمخزن آلياً
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Sale Lookup Card */}
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">الخطوة ١: البحث عن الفاتورة الأصلية</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <SaleLookup onSelectSale={handleSelectSale} />
        </CardContent>
      </Card>

      {/* Step 2: Sale Items & Return Configuration */}
      {selectedSale && (
        <div className="space-y-6">
          {/* Sale Meta Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131B2A] border border-slate-200 dark:border-[#223049] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  فاتورة رقم: {selectedSale.invoiceNumber}
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  {formatDate(selectedSale.createdAt)} • الكاشير: {selectedSale.cashierName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500">
                العميل: <strong>{selectedSale.customerName || 'عميل نقدي'}</strong>
              </span>
              <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
                الإجمالي: {formatCurrency(selectedSale.total)}
              </span>
            </div>
          </div>

          {/* Items selection table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              الخطوة ٢: حدد الأصناف والكميات المراد إرجاعها
            </h3>
            <ReturnItemsTable
              saleItems={selectedSale.items}
              selectedItems={selectedItems}
              onToggleItem={handleToggleItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>

          {/* Reason & Financial Summary Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Card className="rounded-3xl shadow-xs">
              <CardContent className="p-5 space-y-4">
                <ReturnReasonSelect value={reason} onChange={setReason} />
              </CardContent>
            </Card>

            <RefundSummary
              itemCount={selectedList.length}
              totalRefund={totalRefund}
              taxAmount={0}
              onConfirm={handleSubmitReturn}
              isLoading={createReturnMutation.isPending}
              disabled={selectedList.length === 0}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && completedReturn && (
        <RefundSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          saleReturn={completedReturn}
          onNewReturn={handleNewReturn}
        />
      )}
    </div>
  );
};
