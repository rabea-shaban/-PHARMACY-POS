import React, { useState } from 'react';
import { salesApi } from '../../sales/api/salesApi.js';
import { Sale } from '../../sales/types/sale.types.js';
import { Search, Barcode, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input.js';

export interface SaleLookupProps {
  onSelectSale: (sale: Sale) => void;
}

export const SaleLookup: React.FC<SaleLookupProps> = ({ onSelectSale }) => {
  const [invoiceQuery, setInvoiceQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = invoiceQuery.trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Try lookup by invoice number directly
      const sale = await salesApi.getSaleByInvoice(query);
      if (sale) {
        if (sale.status === 'CANCELLED') {
          setErrorMessage('هذه الفاتورة ملغاة بالفعل ولا يمكن استرجاعها.');
        } else if (sale.status === 'RETURNED') {
          setErrorMessage('تم استرجاع هذه الفاتورة بالكامل مسبقاً.');
        } else {
          onSelectSale(sale);
        }
      } else {
        setErrorMessage(`لم يتم العثور على فاتورة بالرقم: ${query}`);
      }
    } catch {
      setErrorMessage(`لم يتم العثور على فاتورة بالرقم: ${query}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLookup} className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="flex-1">
          <Input
            placeholder="أدخل أو امسح رقم الفاتورة (مثال: INV-1002)..."
            value={invoiceQuery}
            onChange={(e) => setInvoiceQuery(e.target.value)}
            leftIcon={
              isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              ) : (
                <Barcode className="w-4 h-4" />
              )
            }
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !invoiceQuery.trim()}
          className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>بحث عن الفاتورة</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </form>
  );
};
