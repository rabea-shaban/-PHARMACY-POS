import React from 'react';
import { PageHeader } from '../components/common/PageHeader.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Search, Barcode, ShoppingCart, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { clearCart } from '../store/slices/cartSlice.js';
import { formatCurrency } from '../lib/utils.js';

export const POSPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, subtotal, total, discountTotal } = useAppSelector((state) => state.cart);

  return (
    <div className="space-y-6">
      <PageHeader
        title="شاشة نقطة البيع (POS Cashier)"
        description="البحث بالاسم والباركود، سلة المشتريات، وتطبيق الخصومات"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Search & Quick Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="ابحث باسم الدواء أو المادة الفعالة..."
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div className="w-48">
                  <Input
                    placeholder="امسح الباركود..."
                    leftIcon={<Barcode className="w-4 h-4" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الأصناف المتاحة للبيع السريع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center text-slate-400 text-sm">
                سيتم ربط البحث اللحظي بالأدوية وتشغيلات FEFO في مرحلة F05.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: POS Cart & Checkout Summary */}
        <div className="space-y-4">
          <Card className="border-emerald-600/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base">سلة الفاتورة</CardTitle>
              </div>
              {items.length > 0 && (
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  إفراغ السلة
                </button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  السلة فارغة حالياً. قم بإضافة أصناف لبدء البيع.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{item.product.name}</p>
                        <p className="text-slate-400">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-emerald-600">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold text-slate-750">{formatCurrency(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>إجمالي الخصم:</span>
                    <span className="font-semibold">-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-emerald-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full" disabled={items.length === 0}>
                إتمام عملية البيع (Checkout)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
