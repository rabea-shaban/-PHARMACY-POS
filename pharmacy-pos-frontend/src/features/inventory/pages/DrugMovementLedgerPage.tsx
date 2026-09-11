import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileSpreadsheet,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Package,
  RotateCcw,
  Sliders,
  AlertOctagon,
  Hourglass,
  Building2,
  User,
  RefreshCw,
} from 'lucide-react';
import { inventoryApi } from '../api/inventoryApi.js';
import { InventoryTransaction, InventoryTransactionType } from '../types/inventory.types.js';
import { branchesApi } from '../../branches/api/branchesApi.js';
import { Branch } from '../../branches/types/branch.types.js';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { formatDate } from '../../../lib/utils.js';

export const DrugMovementLedgerPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';

  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadBranches = async () => {
    try {
      const res = await branchesApi.getBranches({ isActive: true, limit: 50 });
      setBranches(res.items);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLedger = async () => {
    try {
      setIsLoading(true);
      const res = await inventoryApi.getLedger({
        page,
        limit: 25,
        branchId: selectedBranchId || undefined,
        type: selectedType || undefined,
        search: search.trim() || undefined,
      });
      setTransactions(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.error('Failed to load inventory ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [page, selectedBranchId, selectedType, search]);

  const getTypeBadge = (type: InventoryTransactionType) => {
    switch (type) {
      case 'TRANSFER_IN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ArrowDownLeft className="w-3 h-3" />
            {isAr ? 'تحويل وارد' : 'Transfer In'}
          </span>
        );
      case 'TRANSFER_OUT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            <ArrowUpRight className="w-3 h-3" />
            {isAr ? 'تحويل صادر' : 'Transfer Out'}
          </span>
        );
      case 'SALE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <ShoppingCart className="w-3 h-3" />
            {isAr ? 'بيع POS' : 'Sale'}
          </span>
        );
      case 'PURCHASE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
            <Package className="w-3 h-3" />
            {isAr ? 'مشتريات توريد' : 'Purchase'}
          </span>
        );
      case 'SALE_RETURN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <RotateCcw className="w-3 h-3" />
            {isAr ? 'مرتجع بيع' : 'Sale Return'}
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Sliders className="w-3 h-3" />
            {isAr ? 'تسوية يدوية' : 'Adjustment'}
          </span>
        );
      case 'DAMAGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <AlertOctagon className="w-3 h-3" />
            {isAr ? 'تالف / هالك' : 'Damage'}
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
            <Hourglass className="w-3 h-3" />
            {isAr ? 'منتهي الصلاحية' : 'Expired'}
          </span>
        );
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? 'دفتر حركة المخزون العام' : 'Drug Movement & Stock Ledger'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {isAr
                ? 'سجل مزدوج لجميع حركات الدخول والخروج والتحويلات بين الفروع والبيع'
                : 'Double-entry audit ledger for all inward, outward, transfer, and sale movements'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchLedger()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          {isAr ? 'تحديث السجل' : 'Refresh Ledger'}
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={isAr ? 'ابحث برقم الفاتورة، التحويل، اسم الدواء، أو الباركود...' : 'Search drug name, barcode, invoice #...'}
            className="w-full px-4 py-2.5 ps-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
        </div>

        {/* Branch Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold"
          >
            <option value="">{isAr ? 'جميع الفروع' : 'All Branches'}</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold"
          >
            <option value="">{isAr ? 'جميع أنواع الحركات' : 'All Movement Types'}</option>
            <option value="TRANSFER_IN">{isAr ? 'تحويل وارد (Transfer In)' : 'Transfer In'}</option>
            <option value="TRANSFER_OUT">{isAr ? 'تحويل صادر (Transfer Out)' : 'Transfer Out'}</option>
            <option value="SALE">{isAr ? 'مبيعات POS (Sale)' : 'Sale'}</option>
            <option value="PURCHASE">{isAr ? 'مشتريات وتوريد (Purchase)' : 'Purchase'}</option>
            <option value="SALE_RETURN">{isAr ? 'مرتجع بيع (Sale Return)' : 'Sale Return'}</option>
            <option value="ADJUSTMENT">{isAr ? 'تسوية يدوية (Adjustment)' : 'Adjustment'}</option>
            <option value="DAMAGE">{isAr ? 'تالف وهالك (Damage)' : 'Damage'}</option>
            <option value="EXPIRED">{isAr ? 'منتهي الصلاحية (Expired)' : 'Expired'}</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-start">{isAr ? 'الدواء والتشغيلة' : 'Medicine & Batch'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'الفرع' : 'Branch'}</th>
                <th className="py-3.5 px-3 text-center">{isAr ? 'نوع الحركة' : 'Type'}</th>
                <th className="py-3.5 px-3 text-center">{isAr ? 'الكمية' : 'Quantity'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'المرجع والسبب' : 'Reference / Reason'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'المسؤول' : 'Actor'}</th>
                <th className="py-3.5 px-4 text-end">{isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {isAr ? 'لا توجد حركات مخزنية مسجلة' : 'No stock transactions found'}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    {/* Medicine & Batch */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{tx.product?.name || 'دواء'}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                          {tx.product?.barcode && <span>{tx.product.barcode}</span>}
                          {tx.batch?.batchNumber && <span>• B: {tx.batch.batchNumber}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tx.branch?.name || (isAr ? 'عام' : 'General')}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-3 text-center">{getTypeBadge(tx.type)}</td>

                    {/* Quantity Delta */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`font-mono font-black text-xs px-2.5 py-1 rounded-lg ${
                          tx.quantity > 0
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                      </span>
                    </td>

                    {/* Reference & Reason */}
                    <td className="py-3.5 px-3 text-[11px]">
                      {tx.referenceId && (
                        <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {tx.referenceId}
                        </p>
                      )}
                      <p className="text-slate-500 dark:text-slate-400 truncate max-w-xs">{tx.reason}</p>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-3 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tx.createdBy?.name || 'النظام'}</span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-end text-[11px] text-slate-400 font-mono">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">
              {isAr
                ? `صفحة ${page} من ${totalPages} (${totalCount} حركة)`
                : `Page ${page} of ${totalPages} (${totalCount} entries)`}
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
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {isAr ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
