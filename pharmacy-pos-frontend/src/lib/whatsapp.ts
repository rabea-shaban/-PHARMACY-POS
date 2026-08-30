import { Sale } from '../features/sales/types/sale.types.js';
import { formatCurrency, formatDateTime } from './utils.js';

export interface WhatsAppPharmacySettings {
  pharmacyName?: string;
  pharmacySlogan?: string;
  pharmacyPhone?: string;
  pharmacyAddress?: string;
}

/**
 * Clean and format phone number for WhatsApp wa.me / API URL
 * Handles Egyptian local numbers (01xxxxxxxxx -> 201xxxxxxxxx), international formats, etc.
 */
export function formatPhoneNumberForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '').trim();

  // If starts with +, remove +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 00, remove 00
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }

  // If Egyptian local mobile (e.g. 010..., 011..., 012..., 015... - 11 digits)
  if (/^01[0125]\d{8}$/.test(cleaned)) {
    cleaned = '20' + cleaned.substring(1);
  }

  return cleaned;
}

/**
 * Generate a professional WhatsApp invoice message text
 */
export function generateWhatsAppInvoiceText(
  sale: Sale,
  settings?: WhatsAppPharmacySettings
): string {
  const pharmacyTitle = settings?.pharmacyName || 'الصيدلية';
  const customerTitle = sale.customerName?.trim() || 'عميلنا العزيز';

  const lines: string[] = [];

  lines.push(`🏥 *${pharmacyTitle}*`);
  if (settings?.pharmacySlogan) {
    lines.push(`_${settings.pharmacySlogan}_`);
  }
  lines.push('');
  lines.push(`مرحباً بك *${customerTitle}* 👋`);
  lines.push(`شكراً لثقتكم بنا. تفاصيل فاتورة مشترياتكم:`);
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`🧾 *رقم الفاتورة:* ${sale.invoiceNumber}`);
  lines.push(`📅 *التاريخ:* ${formatDateTime(sale.createdAt)}`);
  if (sale.cashierName) {
    lines.push(`👨‍⚕️ *الكاشير:* ${sale.cashierName}`);
  }
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`📦 *الأصناف:*`);

  (sale.items || []).forEach((item, index) => {
    const itemTotal = formatCurrency(item.total);
    const unitPrice = formatCurrency(item.unitPrice);
    lines.push(
      `${index + 1}. *${item.productName}*\n   الكمية: ${item.quantity} × ${unitPrice} = *${itemTotal}*`
    );
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💵 *المجموع الفرعي:* ${formatCurrency(sale.subtotal)}`);

  if (sale.discount > 0) {
    lines.push(`🏷️ *الخصم:* -${formatCurrency(sale.discount)}`);
  }

  if (sale.insuranceAmount > 0) {
    lines.push(`🛡️ *تغطية التأمين:* -${formatCurrency(sale.insuranceAmount)}`);
  }

  if (sale.tax > 0) {
    lines.push(`📊 *الضريبة:* +${formatCurrency(sale.tax)}`);
  }

  lines.push(`💰 *الإجمالي النهائي:* *${formatCurrency(sale.total)}*`);
  lines.push(`✅ *المدفوع:* ${formatCurrency(sale.paidAmount)}`);

  if (sale.remainingAmount > 0) {
    lines.push(`⚠️ *المتبقي:* ${formatCurrency(sale.remainingAmount)}`);
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push('❤️ *نتمنى لكم دوام الصحة والعافية!*');

  if (settings?.pharmacyPhone) {
    lines.push(`📞 للتواصل والاستفسار: ${settings.pharmacyPhone}`);
  }
  if (settings?.pharmacyAddress) {
    lines.push(`📍 العنوان: ${settings.pharmacyAddress}`);
  }

  return lines.join('\n');
}

/**
 * Builds the WhatsApp wa.me direct URL
 */
export function getWhatsAppDirectUrl(
  sale: Sale,
  settings?: WhatsAppPharmacySettings,
  overridePhone?: string
): string {
  const targetPhone = overridePhone || sale.customerPhone || '';
  const cleanPhone = targetPhone ? formatPhoneNumberForWhatsApp(targetPhone) : '';
  const message = generateWhatsAppInvoiceText(sale, settings);
  const encodedMessage = encodeURIComponent(message);

  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  // If no phone is provided, open WhatsApp with prefilled message to choose recipient
  return `https://api.whatsapp.com/send?text=${encodedMessage}`;
}

/**
 * Opens the WhatsApp invoice directly in a new tab or app window
 */
export function openWhatsAppInvoice(
  sale: Sale,
  settings?: WhatsAppPharmacySettings,
  overridePhone?: string
): void {
  const url = getWhatsAppDirectUrl(sale, settings, overridePhone);
  window.open(url, '_blank', 'noopener,noreferrer');
}
