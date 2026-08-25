import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/common/PageHeader.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Search, Barcode, ShoppingCart, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { clearCart } from '../store/slices/cartSlice.js';
import { formatCurrency } from '../lib/utils.js';

export const POSPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, subtotal, total, discountTotal } = useAppSelector((state) => state.cart);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pos.title')}
        description={t('pos.subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Search & Quick Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={t('pos.searchPlaceholder')}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div className="w-56">
                  <Input
                    placeholder={t('pos.barcodePlaceholder')}
                    leftIcon={<Barcode className="w-4 h-4" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('pos.quickCatalog')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-16 text-center text-slate-400 dark:text-slate-500 text-sm">
                {t('pos.fefoNotice')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: POS Cart & Checkout Summary */}
        <div className="space-y-4">
          <Card className="border-sky-200 dark:border-sky-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">{t('pos.cartTitle')}</CardTitle>
              </div>
              {items.length > 0 && (
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t('pos.clearCart')}
                </button>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="p-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                  {t('pos.emptyCart')}
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#1E293B] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{item.product.name}</p>
                        <p className="text-slate-400">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                      </div>
                      <span className="font-black text-sky-600 dark:text-sky-400">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                  <span>{t('pos.subtotal')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{t('pos.discount')}</span>
                    <span>-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-[#1E293B]">
                  <span>{t('pos.grandTotal')}</span>
                  <span className="text-sky-600 dark:text-sky-400 text-xl">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full text-base py-3 font-black shadow-lg shadow-sky-600/20"
                disabled={items.length === 0}
              >
                {t('pos.checkoutButton')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
