import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { updateQuantity, removeItem } from '../../../store/slices/cartSlice.js';
import { CartItem } from './CartItem.js';
import { ShoppingCart } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState.js';

export const CartPanel: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const totalQuantity = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0B0F17]/40 rounded-3xl border border-slate-200/80 dark:border-[#1E293B] overflow-hidden">
      {/* Cart Items List Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#131B2A] border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">
            {t('pos.cartTitle')}
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          {totalQuantity} {t('dashboard.unitsUnit')}
        </span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center py-12">
            <EmptyState
              icon={ShoppingCart}
              title={t('pos.emptyCartTitle') || 'السلة فارغة'}
              description={t('pos.emptyCartDesc') || 'امسح الباركود أو ابحث عن الأدوية لإضافتها إلى الفاتورة'}
            />
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQty={(qty) =>
                dispatch(updateQuantity({ productId: item.productId, quantity: qty }))
              }
              onRemove={() => dispatch(removeItem(item.productId))}
            />
          ))
        )}
      </div>
    </div>
  );
};
