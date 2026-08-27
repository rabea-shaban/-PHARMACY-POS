import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sale } from '../types/sale.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';
import { PharmacyBrandLogo } from '../../../components/common/PharmacyBrandLogo.js';

export interface ReceiptPreviewProps {
  sale: Sale;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ sale }) => {
  const { t } = useTranslation();
  const { publicSettings } = useAppSelector((state) => state.settings);

  return (
    <div
      id="pos-receipt-print"
      className="p-6 bg-white text-slate-900 font-mono text-xs max-w-sm mx-auto border border-dashed border-slate-300 rounded-3xl shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-center mb-2">
          <PharmacyBrandLogo size="lg" showFallbackGradient={false} />
        </div>
        <h2 className="text-base font-black tracking-tight text-slate-900">
          {publicSettings.pharmacyName || t('common.pharmacyName')}
        </h2>
        {publicSettings.pharmacySlogan && (
          <p className="text-[11px] font-bold text-sky-700">
            {publicSettings.pharmacySlogan}
          </p>
        )}
        {(publicSettings.pharmacyLicense || publicSettings.pharmacyTaxNumber) && (
          <p className="text-[10px] text-slate-500">
            {publicSettings.pharmacyLicense ? `سجل/ترخيص: ${publicSettings.pharmacyLicense}` : ''}
            {publicSettings.pharmacyLicense && publicSettings.pharmacyTaxNumber ? ' • ' : ''}
            {publicSettings.pharmacyTaxNumber ? `بطاقة ضريبية: ${publicSettings.pharmacyTaxNumber}` : ''}
          </p>
        )}
        {(publicSettings.pharmacyPhone || publicSettings.pharmacyAddress) && (
          <p className="text-[10px] text-slate-500">
            {publicSettings.pharmacyPhone ? `هاتف: ${publicSettings.pharmacyPhone}` : ''}
            {publicSettings.pharmacyPhone && publicSettings.pharmacyAddress ? ' • ' : ''}
            {publicSettings.pharmacyAddress ? publicSettings.pharmacyAddress : ''}
          </p>
        )}
      </div>

      {/* Invoice Details */}
      <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between">
          <span>رقم الفاتورة:</span>
          <span className="font-bold font-mono">{sale.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ والوقت:</span>
          <span>{formatDate(sale.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>الكاشير:</span>
          <span>{sale.cashierName}</span>
        </div>
        {sale.customerName && (
          <div className="flex justify-between">
            <span>العميل:</span>
            <span className="font-bold">{sale.customerName}</span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between font-bold text-[10px] text-slate-400 pb-1 border-b border-slate-200">
          <span className="flex-1">الصنف</span>
          <span className="w-10 text-center">الكمية</span>
          <span className="w-16 text-end">الإجمالي</span>
        </div>
        {sale.items.map((item) => (
          <div key={item.id} className="flex justify-between text-[11px]">
            <div className="flex-1 truncate pe-1">
              <p className="font-bold truncate">{item.productName}</p>
              <p className="text-[10px] text-slate-400">{formatCurrency(item.unitPrice)}</p>
            </div>
            <span className="w-10 text-center font-bold">{item.quantity}</span>
            <span className="w-16 text-end font-bold font-mono">
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}
      </div>

      {/* Financials Breakdown */}
      <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between">
          <span>المجموع الفرعي:</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-rose-600 font-bold">
            <span>
              الخصم ({sale.subtotal > 0 ? ((sale.discount / sale.subtotal) * 100).toFixed(1).replace(/\.0$/, '') : 0}%):
            </span>
            <span>-{formatCurrency(sale.discount)}</span>
          </div>
        )}
        {sale.insuranceAmount > 0 && (
          <div className="flex justify-between text-teal-600">
            <span>تغطية التأمين:</span>
            <span>-{formatCurrency(sale.insuranceAmount)}</span>
          </div>
        )}
        {sale.tax > 0 && (
          <div className="flex justify-between">
            <span>الضريبة:</span>
            <span>+{formatCurrency(sale.tax)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200">
          <span>الإجمالي النهائي:</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
      </div>

      {/* Payment methods */}
      <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
        {sale.payments.map((p) => (
          <div key={p.id} className="flex justify-between">
            <span>طريقة الدفع ({p.paymentMethod}):</span>
            <span className="font-bold">{formatCurrency(p.amount)}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-500 space-y-1">
        <p className="font-bold">نتمنى لكم دوام الصحة والعافية!</p>
        <p>المرتجعات مقبولة خلال ١٤ يوماً بوجود أصل الفاتورة.</p>
        <p className="text-[9px] text-slate-400">Powered by {publicSettings.pharmacyName || 'Pharmacy POS'}</p>
      </div>
    </div>
  );
};
