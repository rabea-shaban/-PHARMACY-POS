import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks.js';
import { addItem } from '../../../store/slices/cartSlice.js';
import { productsApi } from '../../products/api/productsApi.js';
import { Product } from '../../products/types/product.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Search, Pill, Loader2, AlertCircle } from 'lucide-react';

export interface ProductSearchProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ inputRef: externalRef }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const localRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || localRef;
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.searchProducts(query.trim(), 12);
        setResults(data || []);
        setIsOpen(true);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (product: Product) => {
    if (product.currentStock <= 0) {
      alert(`${product.name} نفد من المخزون تماماً!`);
      return;
    }
    dispatch(addItem({ product, quantity: 1 }));
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectProduct(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder={t('pos.searchPlaceholder')}
          className="block w-full rounded-2xl border py-2.5 ps-10 pe-4 text-xs transition-all bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute start-0 end-0 mt-2 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-[#223049] rounded-3xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1E293B] p-2">
          {results.map((product, idx) => {
            const isSelected = idx === selectedIndex;
            const isOutOfStock = product.currentStock <= 0;

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-start transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-[#1C273B] text-sky-900 dark:text-white ring-1 ring-sky-500/30'
                    : 'hover:bg-slate-50 dark:hover:bg-[#151F30]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 shrink-0 font-bold">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {product.barcode} {product.scientificName ? `• ${product.scientificName}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-end shrink-0 ps-3">
                  <p className="font-black text-xs text-sky-600 dark:text-sky-400">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      isOutOfStock
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : product.currentStock <= product.minimumStock
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isOutOfStock
                      ? t('products.statusOutOfStock')
                      : `${t('products.currentStockLabel')}: ${product.currentStock}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && results.length === 0 && !isLoading && (
        <div className="absolute start-0 end-0 mt-2 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-[#223049] rounded-2xl shadow-xl z-50 p-4 text-center text-xs text-slate-400">
          <AlertCircle className="w-5 h-5 mx-auto mb-1 text-slate-400" />
          {t('products.noProductsFound')}
        </div>
      )}
    </div>
  );
};
