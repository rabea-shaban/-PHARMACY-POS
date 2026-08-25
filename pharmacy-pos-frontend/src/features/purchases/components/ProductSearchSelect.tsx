import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { productsApi } from '../../products/api/productsApi.js';
import { Product } from '../../products/types/product.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Search, Pill, Loader2 } from 'lucide-react';

export interface ProductSearchSelectProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  onSelectProduct,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.searchProducts(query.trim(), 10);
        setResults(data || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-sky-600" /> : <Search className="w-4 h-4" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('purchases.searchProductPlaceholder')}
          className="block w-full rounded-2xl border py-2.5 ps-10 pe-4 text-xs transition-all bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute start-0 end-0 mt-2 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-[#223049] rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1E293B] p-1.5">
          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-[#1C273B] text-start transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="min-w-0 truncate">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {product.barcode} {product.scientificName ? `• ${product.scientificName}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-end shrink-0 ps-3">
                <p className="font-black text-xs text-sky-600 dark:text-sky-400">
                  {formatCurrency(product.purchasePrice)}
                </p>
                <span className="text-[10px] text-slate-400">
                  {t('products.currentStockLabel')}: {product.currentStock}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
