import React, { useState } from 'react';
import { InsuranceClaimRecord } from '../types/insurance.types.js';
import { InsuranceClaimSlipModal } from './InsuranceClaimSlipModal.js';
import { Button } from '../../../components/ui/Button.js';
import { formatCurrency, formatDateTime } from '../../../lib/utils.js';
import { FileText, Printer, Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input.js';

export interface InsuranceClaimsTableProps {
  claims: InsuranceClaimRecord[];
  isLoading?: boolean;
}

export const InsuranceClaimsTable: React.FC<InsuranceClaimsTableProps> = ({
  claims,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaimRecord | null>(null);

  const filteredClaims = claims.filter((c) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      c.claimReference.toLowerCase().includes(term) ||
      c.invoiceNumber.toLowerCase().includes(term) ||
      c.customerName.toLowerCase().includes(term) ||
      c.providerName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="بحث برقم المطالبة، الفاتورة، أو اسم العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <span className="text-xs font-mono text-slate-500 font-bold">
          إجمالي المطالبات: {filteredClaims.length} مطالبة
        </span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
          جاري تحميل سجل وسندات المطالبات التأمينية...
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            لا توجد مطالبات تأمينية مسجلة مطابقة للبحث
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-bold uppercase">
              <tr>
                <th className="py-3 px-4 text-start">مرجع المطالبة</th>
                <th className="py-3 px-4 text-start">الفاتورة / التاريخ</th>
                <th className="py-3 px-4 text-start">العميل / المريض</th>
                <th className="py-3 px-4 text-start">جهة التأمين</th>
                <th className="py-3 px-4 text-end">مبلغ التأمين المغطى</th>
                <th className="py-3 px-4 text-end">تحمل العميل (Co-Pay)</th>
                <th className="py-3 px-4 text-end">إجمالي الفاتورة</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
              {filteredClaims.map((claim) => (
                <tr
                  key={claim.claimReference}
                  className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 px-2 py-0.5 rounded-md">
                      {claim.claimReference}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">
                      #{claim.invoiceNumber}
                    </p>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                      {formatDateTime(claim.saleDate)}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{claim.customerName}</p>
                    {claim.customerPhone && (
                      <p className="font-mono text-[10px] text-slate-500">{claim.customerPhone}</p>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {claim.providerName}
                    </span>
                    <span className="text-[10px] text-emerald-600 block font-mono font-bold">
                      ({claim.coveragePercentage}% تغطية)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-end font-mono font-bold text-emerald-600">
                    {formatCurrency(claim.coveredAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-end font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(claim.customerAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-end font-mono text-slate-500">
                    {formatCurrency(claim.totalSaleAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedClaim(claim)}
                      leftIcon={<Printer className="w-3.5 h-3.5" />}
                    >
                      سند المطالبة
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InsuranceClaimSlipModal
        claim={selectedClaim}
        isOpen={Boolean(selectedClaim)}
        onClose={() => setSelectedClaim(null)}
      />
    </div>
  );
};
