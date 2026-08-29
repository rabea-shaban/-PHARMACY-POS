import type { Sale } from '../features/sales/types/sale.types.js';
import type { SaleReturn } from '../features/returns/types/return.types.js';
import type { ReceiptBranding, PrintReceiptResult } from '../types/electron.js';

export interface DirectPrintOptions {
  printerName?: string;
  paperSize?: '80mm' | '58mm';
  copies?: number;
  silent?: boolean;
}

export function isDirectPrintSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.printer);
}

export function isDirectPrintEnabled(): boolean {
  if (!isDirectPrintSupported()) return false;
  return localStorage.getItem('pos_direct_print') !== 'false';
}

export function getStoredPrinterSettings(): {
  printerName: string;
  paperSize: '80mm' | '58mm';
  copies: number;
  directPrint: boolean;
} {
  return {
    printerName: localStorage.getItem('pos_printer_name') || '',
    paperSize: (localStorage.getItem('pos_paper_size') as '80mm' | '58mm') || '80mm',
    copies: parseInt(localStorage.getItem('pos_print_copies') || '1', 10) || 1,
    directPrint: localStorage.getItem('pos_direct_print') !== 'false',
  };
}

/**
 * Direct Thermal Printing for Sales Invoice Receipts
 * Performs silent printing via Electron hardware bridge when available, or fallbacks to browser print dialog.
 */
export async function printSaleReceipt(
  sale: Sale,
  branding?: ReceiptBranding,
  customOptions?: DirectPrintOptions
): Promise<PrintReceiptResult> {
  const stored = getStoredPrinterSettings();

  if (isDirectPrintSupported() && stored.directPrint) {
    try {
      const printerName = customOptions?.printerName || stored.printerName || undefined;
      const paperSize = customOptions?.paperSize || stored.paperSize || '80mm';
      const copies = customOptions?.copies || stored.copies || 1;

      const result = await window.electronAPI!.printer.printSale({
        sale,
        branding,
        options: {
          printerName,
          paperSize,
          copies,
          silent: customOptions?.silent !== false,
        },
      });

      if (result.success) {
        return result;
      }
      console.warn('[Printer] Direct print failed, falling back to browser print:', result.error);
    } catch (err: any) {
      console.warn('[Printer] Exception during direct printing:', err);
    }
  }

  // Fallback to standard print dialog
  if (typeof window !== 'undefined') {
    window.print();
  }
  return { success: true, printerName: 'Browser Print Fallback' };
}

/**
 * Direct Thermal Printing for Return Credit Note Receipts
 */
export async function printReturnReceipt(
  saleReturn: SaleReturn,
  branding?: ReceiptBranding,
  customOptions?: DirectPrintOptions
): Promise<PrintReceiptResult> {
  const stored = getStoredPrinterSettings();

  if (isDirectPrintSupported() && stored.directPrint) {
    try {
      const printerName = customOptions?.printerName || stored.printerName || undefined;
      const paperSize = customOptions?.paperSize || stored.paperSize || '80mm';
      const copies = customOptions?.copies || stored.copies || 1;

      const result = await window.electronAPI!.printer.printReturn({
        saleReturn,
        branding,
        options: {
          printerName,
          paperSize,
          copies,
          silent: customOptions?.silent !== false,
        },
      });

      if (result.success) {
        return result;
      }
      console.warn('[Printer] Direct return print failed, falling back to browser print:', result.error);
    } catch (err: any) {
      console.warn('[Printer] Exception during return printing:', err);
    }
  }

  // Fallback to standard print dialog
  if (typeof window !== 'undefined') {
    window.print();
  }
  return { success: true, printerName: 'Browser Print Fallback' };
}
