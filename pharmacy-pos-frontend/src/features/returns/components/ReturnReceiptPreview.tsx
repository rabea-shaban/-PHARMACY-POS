import React from 'react';
import { useTranslation } from 'react-i18next';
import { SaleReturn } from '../types/return.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';
import { PharmacyBrandLogo } from '../../../components/common/PharmacyBrandLogo.js';

export interface ReturnReceiptPreviewProps {
  saleReturn: SaleReturn;
}

export const ReturnReceiptPreview: React.FC<ReturnReceiptPreviewProps> = ({ saleReturn }) => {
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
        <p className="text-[11px] font-bold text-rose-700 bg-rose-50 py-0.5 rounded">
          إشعار دائن / إيصال استرجاع بضاعة (Credit Note)
        </p>
        {(publicSettings.pharmacyPhone || publicSettings.pharmacyAddress) && (
          <p className="text-[10px] text-slate-500 font-mono">
            {publicSettings.pharmacyPhone ? `هاتف: ${publicSettings.pharmacyPhone}` : ''}
            {publicSettings.pharmacyPhone && publicSettings.pharmacyAddress ? ' • ' : ''}
            {publicSettings.pharmacyAddress ? publicSettings.pharmacyAddress : ''}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between">
          <span>رقم إشعار الإرجاع:</span>
          <span className="font-bold font-mono">{saleReturn.returnNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>رقم الفاتورة الأصلية:</span>
          <span className="font-bold font-mono">{saleReturn.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ والوقت:</span>
          <span>{formatDate(saleReturn.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>الموظف المسؤول:</span>
          <span>{saleReturn.processedByName}</span>
        </div>
        {saleReturn.customerName && (
          <div className="flex justify-between">
            <span>العميل:</span>
            <span className="font-bold">{saleReturn.customerName}</span>
          </div>
        )}
        {saleReturn.reason && (
          <div className="flex justify-between text-slate-600 pt-1">
            <span>السبب:</span>
            <span className="italic">{saleReturn.reason}</span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between font-bold text-[10px] text-slate-400 pb-1 border-b border-slate-200">
          <span className="flex-1">الصنف المسترجع</span>
          <span className="w-10 text-center">الكمية</span>
          <span className="w-16 text-end">المسترد</span>
        </div>
        {saleReturn.items.map((item) => (
          <div key={item.id} className="flex justify-between text-[11px]">
            <div className="flex-1 truncate pe-1">
              <p className="font-bold truncate">{item.productName}</p>
              {item.batchNumber && (
                <p className="text-[10px] text-slate-400 font-mono">تشغيلة: {item.batchNumber}</p>
              )}
            </div>
            <span className="w-10 text-center font-bold">{item.quantity}</span>
            <span className="w-16 text-end font-bold font-mono text-rose-600">
              {formatCurrency(item.refundAmount)}
            </span>
          </div>
        ))}
      </div>

      {/* Financials Breakdown */}
      <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between">
          <span>المجموع المسترد:</span>
          <span>{formatCurrency(saleReturn.subtotal)}</span>
        </div>
        {saleReturn.tax > 0 && (
          <div className="flex justify-between">
            <span>تسوية الضريبة:</span>
            <span>+{formatCurrency(saleReturn.tax)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200 text-rose-600">
          <span>إجمالي المبلغ المسترد:</span>
          <span>{formatCurrency(saleReturn.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-500 space-y-1">
        <p className="font-bold">تم استرجاع المنتجات بنجاح إلى المخزون (FEFO Return)</p>
        <p className="text-[9px] text-slate-400">Powered by Al-Amal Pharmacy POS</p>
      </div>
    </div>
  );
};
