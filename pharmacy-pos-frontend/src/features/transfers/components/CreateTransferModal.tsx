import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  ArrowRightLeft,
  Building2,
  Trash2,
  Search,
  AlertCircle,
} from 'lucide-react';
import { transfersApi } from '../api/transfersApi.js';
import { branchesApi } from '../../branches/api/branchesApi.js';
import { Branch } from '../../branches/types/branch.types.js';
import { productsApi } from '../../products/api/productsApi.js';
import { Product } from '../../products/types/product.types.js';
import { CreateTransferItemPayload } from '../types/transfer.types.js';
import { Button } from '../../../components/ui/Button.js';

export interface CreateTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetProduct?: {
    id: string;
    name: string;
    barcode?: string;
    sellingPrice?: number;
  };
  onSuccess: () => void;
}

interface TransferItemDraft extends CreateTransferItemPayload {
  productName: string;
  barcode?: string;
  maxAvailable?: number;
}

export const CreateTransferModal: React.FC<CreateTransferModalProps> = ({
  isOpen,
  onClose,
  presetProduct,
  onSuccess,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';

  const [branches, setBranches] = useState<Branch[]>([]);
  const [fromBranchId, setFromBranchId] = useState<string>('');
  const [toBranchId, setToBranchId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItemDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchesApi.getBranches({ isActive: true, limit: 50 });
        setBranches(res.items);
        if (res.items.length >= 2) {
          const main = res.items.find((b) => b.isMain) || res.items[0];
          const other = res.items.find((b) => b.id !== main.id) || res.items[1];
          setFromBranchId(main.id);
          setToBranchId(other.id);
        }
      } catch (err) {
        console.error('Failed to load branches:', err);
      }
    };
    if (isOpen) {
      fetchBranches();
      if (presetProduct) {
        setItems([
          {
            productId: presetProduct.id,
            productName: presetProduct.name,
            barcode: presetProduct.barcode,
            quantity: 5,
            unitCost: 0,
          },
        ]);
      } else {
        setItems([]);
      }
    }
  }, [isOpen, presetProduct]);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const res = await productsApi.searchProducts(q.trim(), 8);
      setSearchResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddProduct = (prod: Product) => {
    if (items.some((i) => i.productId === prod.id)) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    // Determine available stock in source branch if batches exist
    const branchStock = (prod.batches || [])
      .filter((b: any) => !b.branchId || b.branchId === fromBranchId)
      .reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);

    setItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        productName: prod.name,
        barcode: prod.barcode || undefined,
        quantity: 1,
        unitCost: Number(prod.purchasePrice || 0),
        maxAvailable: branchStock > 0 ? branchStock : prod.currentStock,
      },
    ]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUpdateItemQty = (index: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fromBranchId || !toBranchId) {
      setErrorMessage(isAr ? 'يرجى تحديد فرع المصدر وفرع الوجهة' : 'Please select both source and destination branches');
      return;
    }

    if (fromBranchId === toBranchId) {
      setErrorMessage(isAr ? 'فرع المصدر وفرع الوجهة يجب أن يكونا مختلفين' : 'Source and destination branches cannot be the same');
      return;
    }

    if (items.length === 0) {
      setErrorMessage(isAr ? 'يرجى إضافة دواء واحد على الأقل للتحويل' : 'Please add at least one item to transfer');
      return;
    }

    try {
      setIsSubmitting(true);
      await transfersApi.createTransfer({
        fromBranchId,
        toBranchId,
        notes: notes.trim() || null,
        items: items.map((it) => ({
          productId: it.productId,
          batchId: it.batchId || null,
          quantity: it.quantity,
          unitCost: it.unitCost,
          notes: it.notes || null,
        })),
      });

      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create transfer request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isAr ? 'إنشاء طلب تحويل مخزون بين الفروع' : 'Create Inter-Branch Stock Transfer'}
              </h3>
              <p className="text-xs text-indigo-100">
                {isAr ? 'نقل تشغيلات وأدوية مع تتبع آلي للحركات والرصيد' : 'Transfer batches with automated ledger reconciliation'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300 rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Source & Destination Branches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                {isAr ? 'فرع المصدر (من)' : 'Source Branch (From)'}
              </label>
              <select
                value={fromBranchId}
                onChange={(e) => setFromBranchId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                required
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) {b.isMain ? (isAr ? '★ الرئيسي' : '★ Main') : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                {isAr ? 'فرع الوجهة (إلى)' : 'Destination Branch (To)'}
              </label>
              <select
                value={toBranchId}
                onChange={(e) => setToBranchId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
                required
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.id === fromBranchId}>
                    {b.name} ({b.code}) {b.isMain ? (isAr ? '★ الرئيسي' : '★ Main') : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Search and Add */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              {isAr ? 'البحث عن أدوية وإضافتها للتحويل' : 'Search & Add Medicines'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={isAr ? 'اكتب اسم الدواء أو الباركود...' : 'Type drug name or barcode...'}
                className="w-full px-3.5 py-2.5 ps-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
              {isSearching && (
                <p className="text-[11px] text-slate-400 mt-1">{isAr ? 'جاري البحث...' : 'Searching...'}</p>
              )}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-100 dark:divide-slate-700">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleAddProduct(p)}
                      className="w-full p-2.5 text-start hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs flex justify-between items-center transition"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.barcode}</p>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {p.currentStock} {isAr ? 'متاح' : 'avail'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              {isAr ? 'الأصناف المراد تحويلها' : 'Transfer Items'} ({items.length})
            </label>

            {items.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400">
                {isAr ? 'لم تتم إضافة أصناف بعد. ابحث عن الدواء في الأعلى لإضافته.' : 'No items added yet.'}
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                      {item.barcode && <p className="text-[10px] text-slate-400 font-mono">{item.barcode}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-400">{isAr ? 'الكمية:' : 'Qty:'}</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQty(idx, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-center font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold mb-1">{isAr ? 'ملاحظات التحويل (اختياري)' : 'Transfer Notes'}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAr ? 'سبب التحويل، اسم السائق، أو تعليمات خاصة...' : 'Reason for transfer, driver details...'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              {isAr ? 'إرسال طلب التحويل' : 'Submit Transfer Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
