import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInventorySummary } from '../hooks/useInventory.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Button } from '../../../components/ui/Button.js';
import { AlertTriangle, Boxes, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const LowStockPage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useInventorySummary();
  const lowStockItems = data?.lowStockItems || [];

  const canPurchase = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>{t('inventory.lowStockPageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.lowStockPageSubtitle')}
          </p>
        </div>

        {canPurchase && (
          <Link to="/purchases">
            <Button variant="primary" size="md" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              {t('inventory.createPurchaseOrder')}
            </Button>
          </Link>
        )}
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : lowStockItems.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Boxes}
            title={t('dashboard.noLowStock')}
            description={t('dashboard.noLowStockDesc')}
          />
        </Card>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">{t('products.colProduct')}</th>
                  <th className="py-3.5 px-4 text-start">{t('products.colBarcode')}</th>
                  <th className="py-3.5 px-4 text-start">{t('products.colCategory')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colCurrentStock')}</th>
                  <th className="py-3.5 px-4 text-start">{t('dashboard.minThreshold')}</th>
                  <th className="py-3.5 px-4 text-start">{t('inventory.colShortage')}</th>
                  <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {lowStockItems.map((item) => {
                  const shortage = Math.max(0, item.minimumStock - item.currentStock);

                  return (
                    <tr
                      key={item.productId}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {item.productName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {item.barcode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-[11px] font-medium">
                          {item.categoryName || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-600 dark:text-rose-400 text-sm">
                        {item.currentStock} {t('dashboard.unitsUnit')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                        {item.minimumStock} {t('dashboard.unitsUnit')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-black text-[11px]">
                          -{shortage} {t('dashboard.unitsUnit')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-end">
                        <Link
                          to={`/products/${item.productId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 font-bold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('common.view')}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
