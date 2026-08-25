import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { clearCart } from '../../../store/slices/cartSlice.js';
import { Button } from '../../../components/ui/Button.js';
import {
  HeartPulse,
  Trash2,
  Maximize2,
  Minimize2,
  Clock,
  User,
  Keyboard,
  ReceiptText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface POSHeaderProps {
  onOpenShortcuts: () => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({ onOpenShortcuts }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const itemsCount = useAppSelector((state) => state.cart.items.length);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleClear = () => {
    if (itemsCount > 0 && window.confirm(t('pos.confirmClearPrompt') || 'هل تريد إفراغ السلة الحالية؟')) {
      dispatch(clearCart());
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#131B2A] border-b border-slate-200/80 dark:border-[#1E293B] rounded-3xl shadow-xs">
      {/* Brand & Mode */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              {t('pos.title')}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              {t('pos.cashierOnline') || 'الكاشير متصل'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t('common.pharmacyName')}
          </p>
        </div>
      </div>

      {/* Center: Live Clock & Cashier Profile */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          <User className="w-4 h-4 text-slate-400" />
          <span>{user?.name || 'الكاشير'}</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          title={t('pos.shortcutsTitle') || 'اختصارات لوحة المفاتيح (F1)'}
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* View Sales Invoices Ledger Link */}
        <Link
          to="/sales"
          className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          title={t('nav.sales')}
        >
          <ReceiptText className="w-4 h-4" />
        </Link>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Clear Cart */}
        {itemsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            {t('pos.clearCart')}
          </Button>
        )}
      </div>
    </header>
  );
};
