import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks.js';
import { addItem } from '../../../store/slices/cartSlice.js';
import { productsApi } from '../../products/api/productsApi.js';
import { Barcode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export interface BarcodeScannerInputProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const BarcodeScannerInput: React.FC<BarcodeScannerInputProps> = ({ inputRef: externalRef }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const localRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || localRef;

  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcode.trim();
    if (!code) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const product = await productsApi.getProductByBarcode(code);
      if (product) {
        if (!product.isActive) {
          setStatusMessage({ type: 'error', text: `${product.name} موقوف من البيع` });
        } else if (product.currentStock <= 0) {
          setStatusMessage({ type: 'error', text: `${product.name} رصيده 0 في المخزن!` });
        } else {
          dispatch(addItem({ product, quantity: 1 }));
          setStatusMessage({ type: 'success', text: `تمت إضافة: ${product.name}` });
          setBarcode('');
        }
      } else {
        setStatusMessage({ type: 'error', text: `الباركود [${code}] غير مسجل` });
      }
    } catch {
      setStatusMessage({ type: 'error', text: `الباركود [${code}] غير مسجل` });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleScan} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
          ) : (
            <Barcode className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder={t('pos.barcodePlaceholder')}
          className="block w-full rounded-2xl border-2 border-sky-500/40 py-3 ps-11 pe-24 text-sm font-mono transition-all bg-white text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-sky-500/30 dark:text-slate-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading || !barcode.trim()}
          className="absolute inset-y-1.5 end-1.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          {t('common.search')}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`absolute start-0 end-0 -bottom-8 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all z-20 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="truncate">{statusMessage.text}</span>
        </div>
      )}
    </form>
  );
};
