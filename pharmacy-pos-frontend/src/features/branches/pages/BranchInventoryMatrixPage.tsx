import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Search,
  ArrowLeftRight,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { inventoryApi } from '../../inventory/api/inventoryApi.js';
import { InventoryMatrixResponse, InventoryMatrixItem } from '../../inventory/types/inventory.types.js';
import { CreateTransferModal } from '../../transfers/components/CreateTransferModal.js';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';

export const BranchInventoryMatrixPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';

  const [matrixData, setMatrixData] = useState<InventoryMatrixResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [presetTransferProduct, setPresetTransferProduct] = useState<InventoryMatrixItem | null>(null);

  const fetchMatrix = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryApi.getInventoryMatrix({
        page,
        limit: 25,
        search: search.trim() || undefined,
        lowStockOnly: lowStockOnly || undefined,
      });
      setMatrixData(data);
    } catch (err) {
      console.error('Failed to load inventory matrix:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [page, search, lowStockOnly]);

  const handleOpenTransferForProduct = (item: InventoryMatrixItem) => {
    setPresetTransferProduct(item);
    setIsTransferModalOpen(true);
  };

  const handleTransferSuccess = () => {
    setIsTransferModalOpen(false);
    setPresetTransferProduct(null);
    fetchMatrix();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? 'مصفوفة مخزون الفروع' : 'Multi-Branch Inventory Matrix'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {isAr
                ? 'مقارنة أرصدة الأدوية والتشغيلات عبر جميع الفروع والتحويل الفوري بينها'
                : 'Cross-branch drug stock overview, batch tracking, and instant inter-branch transfers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMatrix()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setPresetTransferProduct(null);
              setIsTransferModalOpen(true);
            }}
            leftIcon={<ArrowLeftRight className="w-4 h-4" />}
          >
            {isAr ? 'طلب تحويل مخزون جديد' : 'New Transfer Request'}
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={isAr ? 'ابحث باسم الدواء، الاسم العلمي، أو الباركود...' : 'Search medicine name, barcode...'}
            className="w-full px-4 py-2.5 ps-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => {
                setLowStockOnly(e.target.checked);
                setPage(1);
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {isAr ? 'عرض النواقص فقط (Low Stock)' : 'Low Stock Only'}
            </span>
          </label>
        </div>
      </div>

      {/* Matrix Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-start min-w-[220px]">
                  {isAr ? 'الدواء والبيانات' : 'Drug & Details'}
                </th>
                <th className="py-3.5 px-3 text-center">{isAr ? 'السعر' : 'Price'}</th>
                <th className="py-3.5 px-3 text-center">{isAr ? 'إجمالي الرصيد' : 'Total Stock'}</th>
                {matrixData?.branches.map((b) => (
                  <th key={b.id} className="py-3.5 px-3 text-center min-w-[140px]">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-800 dark:text-slate-200 font-black">{b.name}</span>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                        {b.code} {b.isMain && '★'}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4 + (matrixData?.branches.length || 1)} className="py-12 text-center">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ) : !matrixData || matrixData.items.length === 0 ? (
                <tr>
                  <td colSpan={4 + (matrixData?.branches.length || 1)} className="py-12 text-center text-slate-400">
                    {isAr ? 'لا توجد بيانات مطابقة للبحث' : 'No matching items found in inventory matrix'}
                  </td>
                </tr>
              ) : (
                matrixData.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    {/* Drug Details */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{item.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          {item.barcode && <span className="font-mono">{item.barcode}</span>}
                          {item.category && <span>• {item.category.name}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.sellingPrice)}
                    </td>

                    {/* Total Stock */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold font-mono">
                        <span className={item.isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}>
                          {item.totalStock}
                        </span>
                        {item.isLowStock && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                      </div>
                    </td>

                    {/* Per-Branch Stock Columns */}
                    {item.branchStock.map((bs) => (
                      <td key={bs.branchId} className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg ${
                              bs.stock === 0
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                                : bs.stock <= item.minimumStock
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            }`}
                          >
                            {bs.stock} {isAr ? 'وحدة' : 'units'}
                          </span>
                          {bs.nearestExpiry && (
                            <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              Exp: {formatDate(bs.nearestExpiry).slice(0, 7)}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTransferForProduct(item)}
                        className="text-[11px] py-1 px-2.5"
                        leftIcon={<ArrowLeftRight className="w-3 h-3 text-indigo-600" />}
                      >
                        {isAr ? 'تحويل' : 'Transfer'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {matrixData && matrixData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">
              {isAr
                ? `صفحة ${matrixData.pagination.page} من ${matrixData.pagination.totalPages} (${matrixData.pagination.total} صنف)`
                : `Page ${matrixData.pagination.page} of ${matrixData.pagination.totalPages} (${matrixData.pagination.total} items)`}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {isAr ? 'السابق' : 'Previous'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= matrixData.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {isAr ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Transfer Modal */}
      {isTransferModalOpen && (
        <CreateTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false);
            setPresetTransferProduct(null);
          }}
          presetProduct={
            presetTransferProduct
              ? {
                  id: presetTransferProduct.id,
                  name: presetTransferProduct.name,
                  barcode: presetTransferProduct.barcode || undefined,
                  sellingPrice: presetTransferProduct.sellingPrice,
                }
              : undefined
          }
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};
