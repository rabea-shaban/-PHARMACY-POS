import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks.js';
import { clearCart } from '../store/slices/cartSlice.js';
import { POSHeader } from '../features/sales/components/POSHeader.js';
import { BarcodeScannerInput } from '../features/sales/components/BarcodeScannerInput.js';
import { ProductSearch } from '../features/sales/components/ProductSearch.js';
import { CartPanel } from '../features/sales/components/CartPanel.js';
import { CustomerSelector } from '../features/sales/components/CustomerSelector.js';
import { DiscountSelector } from '../features/sales/components/DiscountSelector.js';
import { InsuranceSelector } from '../features/sales/components/InsuranceSelector.js';
import { LoyaltySummary } from '../features/sales/components/LoyaltySummary.js';
import { SaleSummary } from '../features/sales/components/SaleSummary.js';
import { CheckoutModal } from '../features/sales/components/CheckoutModal.js';
import { InvoiceSuccessModal } from '../features/sales/components/InvoiceSuccessModal.js';
import { POSKeyboardShortcuts } from '../features/sales/components/POSKeyboardShortcuts.js';
import { Sale } from '../features/sales/types/sale.types.js';

export const POSPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts (F1, F2, F8, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (cartItems.length > 0) {
          setIsCheckoutOpen(true);
        }
      } else if (e.key === 'Escape') {
        if (isCheckoutOpen) setIsCheckoutOpen(false);
        if (isSuccessOpen) {
          setIsSuccessOpen(false);
          dispatch(clearCart());
        }
        if (isShortcutsOpen) setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems.length, isCheckoutOpen, isSuccessOpen, isShortcutsOpen, dispatch]);

  const handleCheckoutSuccess = (sale: Sale) => {
    setCompletedSale(sale);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const handleNewSale = () => {
    setIsSuccessOpen(false);
    setCompletedSale(null);
    dispatch(clearCart());
    barcodeInputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] space-y-3 animate-in fade-in duration-300">
      {/* POS Top Navigation / Status Header */}
      <POSHeader onOpenShortcuts={() => setIsShortcutsOpen(true)} />

      {/* Main Cashier Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Product Search, Barcode Reader & Cart Items List */}
        <div className="lg:col-span-8 flex flex-col space-y-3 h-full min-h-0">
          {/* Top Controls: Fast Barcode Scanner and Search Autocomplete */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6">
              <BarcodeScannerInput inputRef={barcodeInputRef} />
            </div>
            <div className="sm:col-span-6">
              <ProductSearch inputRef={searchInputRef} />
            </div>
          </div>

          {/* Real-time Cart Items Panel */}
          <div className="flex-1 min-h-0">
            <CartPanel />
          </div>
        </div>

        {/* Right Column: Customer Profile, Discounts, Insurance, Loyalty, and Grand Total Breakdown */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-2.5 h-full overflow-y-auto">
          <div className="space-y-2.5">
            {/* Customer Lookup & Quick Registration */}
            <CustomerSelector />

            {/* Loyalty points deduction widget */}
            <LoyaltySummary />

            {/* Insurance policy co-pay selector */}
            <InsuranceSelector />

            {/* Discount / coupon code selector */}
            <DiscountSelector />
          </div>

          {/* Grand Totals and Final Checkout Trigger */}
          <SaleSummary onOpenCheckout={() => setIsCheckoutOpen(true)} />
        </div>
      </div>

      {/* Checkout Modal with Split Payments */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Invoice Success & Thermal Receipt Print Modal */}
      {isSuccessOpen && completedSale && (
        <InvoiceSuccessModal
          isOpen={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
          sale={completedSale}
          onNewSale={handleNewSale}
        />
      )}

      {/* Keyboard Shortcuts Dialog */}
      {isShortcutsOpen && (
        <POSKeyboardShortcuts
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      )}
    </div>
  );
};
