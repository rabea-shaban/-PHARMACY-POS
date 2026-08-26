import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCreatePurchase } from '../hooks/usePurchases.js';
import { SupplierSelect } from '../components/SupplierSelect.js';
import { ProductSearchSelect } from '../components/ProductSearchSelect.js';
import { PurchaseItemsTable } from '../components/PurchaseItemsTable.js';
import { PurchaseItemFormValues } from '../schemas/purchaseSchemas.js';
import { Product } from '../../products/types/product.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { ShoppingBag, Receipt, AlertCircle } from 'lucide-react';

export const CreatePurchasePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultSupplierId = searchParams.get('supplierId') || '';

  const [supplierId, setSupplierId] = useState(defaultSupplierId);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [items, setItems] = useState<PurchaseItemFormValues[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreatePurchase();

  // Add selected product to purchase items list
  const handleAddProduct = (product: Product) => {
    // Check if already in list
    const existingIndex = items.findIndex((it) => it.productId === product.id);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      setItems(updated);
      return;
    }

    const newItem: PurchaseItemFormValues = {
      productId: product.id,
      productName: product.name,
      barcode: product.barcode || '',
      quantity: 1,
      unitCost: product.purchasePrice || 0,
      discount: 0,
      tax: 0,
      batchNumber: '',
      expiryDate: '',
      sellingPrice: product.sellingPrice || 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof PurchaseItemFormValues, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Calculations for UI preview
  const subtotal = items.reduce((acc, it) => acc + (it.quantity * it.unitCost), 0);
  const estimatedTotal = Math.max(0, subtotal - discount + tax);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!supplierId) {
      setErrorMessage(t('purchases.errorSupplierRequired'));
      return;
    }
    if (!invoiceNumber.trim()) {
      setErrorMessage(t('purchases.errorInvoiceNumberRequired'));
      return;
    }
    if (items.length === 0) {
      setErrorMessage(t('purchases.errorAtLeastOneItem'));
      return;
    }

    try {
      const payload = {
        supplierId,
        invoiceNumber: invoiceNumber.trim(),
        purchaseDate,
        discount,
        tax,
        paidAmount,
        notes: notes || undefined,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          unitCost: it.unitCost,
          discount: it.discount || 0,
          tax: it.tax || 0,
          batchNumber: it.batchNumber || undefined,
          expiryDate: it.expiryDate || undefined,
          sellingPrice: it.sellingPrice || undefined,
        })),
      };

      const result = await createMutation.mutateAsync(payload);
      navigate(`/purchases/${result.id}`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <ShoppingBag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('purchases.createPurchaseTitle')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('purchases.createPurchaseSubtitle')}
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Invoice Meta Information */}
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">{t('purchases.invoiceMetaTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SupplierSelect
              value={supplierId}
              onChange={(id) => setSupplierId(id)}
            />

            <Input
              label={t('purchases.colInvoiceNumber')}
              placeholder="INV-XXXXX"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              leftIcon={<Receipt className="w-4 h-4" />}
              required
            />

            <Input
              label={t('purchases.colPurchaseDate')}
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Selection & Purchase Items */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('purchases.itemsListTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('purchases.itemsListSubtitle')}
            </p>
          </div>

          <div className="w-full sm:w-80">
            <ProductSearchSelect onSelectProduct={handleAddProduct} />
          </div>
        </div>

        <PurchaseItemsTable
          items={items}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
        />
      </div>

      {/* Financial Totals and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="rounded-3xl shadow-xs">
          <CardContent className="p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {t('purchases.invoiceNotes')}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('purchases.invoiceNotesPlaceholder')}
              className="block w-full rounded-2xl border p-3 text-xs bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">{t('purchases.financialSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">{t('pos.subtotal')}:</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">{t('pos.discount')}:</span>
              <div className="w-28">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border py-1 px-2 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-end font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">{t('products.fieldTaxRate')}:</span>
              <div className="w-28">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border py-1 px-2 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-end font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">{t('purchases.fieldPaidAmount') || 'المبلغ المدفوع'}:</span>
              <div className="w-28">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border py-1 px-2 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-end font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-[#1E293B]">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                {t('pos.grandTotal')}:
              </span>
              <span className="font-black text-base text-sky-600 dark:text-sky-400">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/purchases')}
          disabled={createMutation.isPending}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={createMutation.isPending}
          disabled={items.length === 0}
        >
          {t('purchases.saveAndCreateInvoice')}
        </Button>
      </div>
    </form>
  );
};
