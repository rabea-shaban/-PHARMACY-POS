import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import i18n from './i18n.js';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers as Currency (ج.م in Arabic, EGP in English)
export function formatCurrency(amount: number | string, customCurrency?: string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const isArabic = i18n.language === 'ar';
  const currencyLabel = customCurrency || (isArabic ? 'ج.م' : 'EGP');

  if (isNaN(num)) return `0.00 ${currencyLabel}`;
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencyLabel}`;
}

// Format Date string
export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format DateTime string
export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
