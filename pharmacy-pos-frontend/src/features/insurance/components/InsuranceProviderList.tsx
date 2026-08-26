import React from 'react';
import { InsuranceProvider } from '../types/insurance.types.js';
import { InsuranceProviderStatusBadge } from './InsuranceProviderStatusBadge.js';
import { Button } from '../../../components/ui/Button.js';
import { formatDate } from '../../../lib/utils.js';
import { Building2, Phone, Mail, Percent, Edit3, ShieldAlert } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface InsuranceProviderListProps {
  providers: InsuranceProvider[];
  isLoading?: boolean;
  onEditProvider: (provider: InsuranceProvider) => void;
}

export const InsuranceProviderList: React.FC<InsuranceProviderListProps> = ({
  providers,
  isLoading = false,
  onEditProvider,
}) => {
  const { role } = useAppSelector((state) => state.auth);
  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
        جاري تحميل شركات وجهات التأمين المتعاقدة...
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
        <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          لا توجد شركات تأمين مطابقة للبحث أو مسجلة بالنظام
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-start">
        <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-bold uppercase">
          <tr>
            <th className="py-3 px-4 text-start">شركة التأمين / الجهة</th>
            <th className="py-3 px-4 text-center">نسبة التغطية الافتراضية</th>
            <th className="py-3 px-4 text-start">بيانات الاتصال</th>
            <th className="py-3 px-4 text-start">العنوان</th>
            <th className="py-3 px-4 text-center">الحالة</th>
            <th className="py-3 px-4 text-start">تاريخ التسجيل</th>
            {canEdit && <th className="py-3 px-4 text-center">إجراءات</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
          {providers.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</h4>
                    {p.notes && (
                      <p className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">{p.notes}</p>
                    )}
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 font-mono text-xs bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                  <Percent className="w-3 h-3" />
                  {p.defaultCoveragePercentage}%
                </span>
              </td>

              <td className="py-3.5 px-4 space-y-0.5">
                {p.phone && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{p.phone}</span>
                  </div>
                )}
                {p.email && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{p.email}</span>
                  </div>
                )}
                {!p.phone && !p.email && <span className="text-slate-400">—</span>}
              </td>

              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                {p.address || '—'}
              </td>

              <td className="py-3.5 px-4 text-center">
                <InsuranceProviderStatusBadge isActive={p.isActive} />
              </td>

              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                {formatDate(p.createdAt)}
              </td>

              {canEdit && (
                <td className="py-3.5 px-4 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProvider(p)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    تعديل
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
