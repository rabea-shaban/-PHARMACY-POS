import React from 'react';
import { InsuranceClaimRecord } from '../types/insurance.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { formatCurrency, formatDateTime } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';
import { PharmacyBrandLogo } from '../../../components/common/PharmacyBrandLogo.js';
import { Printer } from 'lucide-react';

export interface InsuranceClaimSlipModalProps {
  claim: InsuranceClaimRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceClaimSlipModal: React.FC<InsuranceClaimSlipModalProps> = ({
  claim,
  isOpen,
  onClose,
}) => {
  const { publicSettings } = useAppSelector((state) => state.settings);

  if (!claim) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`سند مطالبة تأمينية: #${claim.claimReference}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Printable Claim Document Container */}
        <div
          id="insurance-claim-slip-print"
          className="p-6 bg-white text-slate-900 border border-slate-300 rounded-2xl shadow-xs font-sans space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <PharmacyBrandLogo size="lg" showFallbackGradient={false} />
              <div>
                <h2 className="text-base font-black text-slate-900">{publicSettings.pharmacyName}</h2>
                <p className="text-[11px] text-slate-600 font-bold">
                  {publicSettings.pharmacySlogan} • ترخيص رقم: {publicSettings.pharmacyLicense || '10482'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {publicSettings.pharmacyAddress} • هاتف: {publicSettings.pharmacyPhone}
                </p>
              </div>
            </div>

            <div className="text-end border-2 border-slate-900 px-3 py-1.5 rounded-xl bg-slate-50">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                سند مطالبة وتغطية تأمين صحي
              </span>
              <span className="text-xs font-black font-mono text-slate-900 block mt-0.5">
                {claim.claimReference}
              </span>
            </div>
          </div>

          {/* Claim Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">شركة التأمين / الجهة:</span>
                <span className="font-bold text-slate-900">{claim.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">اسم المريض / العميل:</span>
                <span className="font-bold text-slate-900">{claim.customerName}</span>
              </div>
              {claim.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الهاتف:</span>
                  <span className="font-mono text-slate-700">{claim.customerPhone}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الفاتورة الأصلية:</span>
                <span className="font-mono font-bold text-sky-700">#{claim.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">تاريخ ووقت المطالبة:</span>
                <span className="font-mono text-slate-700">{formatDateTime(claim.saleDate)}</span>
              </div>
              {claim.cashierName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">الصيدلي المسؤول:</span>
                  <span className="text-slate-900">{claim.cashierName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-start">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                <tr>
                  <th className="py-2.5 px-4 text-start">بيان المحاسبة</th>
                  <th className="py-2.5 px-4 text-center">النسبة المعتمدة</th>
                  <th className="py-2.5 px-4 text-end">المبلغ المستحق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="py-2 px-4 font-sans font-bold">إجمالي قيمة الفاتورة الصيدلانية</td>
                  <td className="py-2 px-4 text-center">100%</td>
                  <td className="py-2 px-4 text-end font-bold">{formatCurrency(claim.totalSaleAmount)}</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="py-2 px-4 font-sans font-bold text-emerald-800">
                    المبلغ المغطى على حساب شركة التأمين (Insurance Covered)
                  </td>
                  <td className="py-2 px-4 text-center font-bold text-emerald-800">
                    {claim.coveragePercentage}%
                  </td>
                  <td className="py-2 px-4 text-end font-bold text-emerald-800">
                    {formatCurrency(claim.coveredAmount)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-sans font-bold text-slate-700">
                    نسبة تحمل المريض / العميل (Customer Co-Pay)
                  </td>
                  <td className="py-2 px-4 text-center font-bold text-slate-700">
                    {100 - claim.coveragePercentage}%
                  </td>
                  <td className="py-2 px-4 text-end font-bold text-slate-900">
                    {formatCurrency(claim.customerAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures & Seal Block */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-dashed border-slate-300 text-xs">
            <div className="text-center space-y-8">
              <p className="font-bold text-slate-700">توقيع المستفيد / المريض</p>
              <p className="text-[11px] text-slate-400 font-mono">...........................................</p>
            </div>
            <div className="text-center space-y-8">
              <p className="font-bold text-slate-700">ختم وتوقيع الصيدلية المعتمد</p>
              <p className="text-[11px] text-slate-400 font-mono">...........................................</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between print:hidden">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            إغلاق
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            طباعة سند المطالبة (Print Claim Slip)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
