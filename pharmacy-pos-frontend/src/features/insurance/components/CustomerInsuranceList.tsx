import React, { useState } from 'react';
import { CustomerInsurance } from '../types/insurance.types.js';
import { CustomerInsuranceModal } from './CustomerInsuranceModal.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface CustomerInsuranceListProps {
  customerId: string;
  customerName: string;
  policies: CustomerInsurance[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const CustomerInsuranceList: React.FC<CustomerInsuranceListProps> = ({
  customerId,
  customerName,
  policies,
  isLoading = false,
  onRefresh,
}) => {
  const { role } = useAppSelector((state) => state.auth);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const canAddPolicy = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  const getPolicyStatus = (policy: CustomerInsurance) => {
    if (!policy.isActive) {
      return {
        label: 'معطلة / غير نشطة',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        icon: <XCircle className="w-3.5 h-3.5" />,
      };
    }

    if (policy.expiryDate) {
      const expiry = new Date(policy.expiryDate);
      const today = new Date();
      if (expiry < today) {
        return {
          label: 'منتهية الصلاحية',
          badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
        };
      }

      // Check if expiring in less than 30 days
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) {
        return {
          label: `تنتهي خلال ${daysUntilExpiry} يوم`,
          badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      }
    }

    return {
      label: 'سارية ونشطة (Active)',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    };
  };

  return (
    <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B]">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                بوالص التأمين الطبي والرعاية الصحية (Insurance Policies)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديد نسبة تحمل العميل، رقم الكارنيه، والخصم التلقائي المعتمد في نقطة البيع (POS)
              </p>
            </div>
          </div>

          {canAddPolicy && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              إضافة بوليصة تأمين للعميل
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
            جاري تحميل بوالص التأمين المرتبطة بالعميل...
          </div>
        ) : !policies || policies.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                لا توجد بوالص تأمين صحي مسجلة لهذا العميل
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                يمكنك ربط كارنيه التأمين الطبي للعميل للاستفادة من نسب الخصم المعتمدة عند الشراء
              </p>
            </div>
            {canAddPolicy && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                ربط بوليصة تأمين الآن
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => {
              const status = getPolicyStatus(policy);
              return (
                <div
                  key={policy.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#223049] space-y-3 hover:border-sky-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-600">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {policy.insuranceProvider?.name || 'شركة تأمين متعاقدة'}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.badgeClass}`}
                    >
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-[#1E293B]/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">رقم البوليصة</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {policy.policyNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">رقم العضوية / الكارنيه</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {policy.memberNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">نسبة التغطية التأمينية</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        {policy.coveragePercentage}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">الحد الأقصى للتغطية</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                        {policy.maxCoverageLimit ? formatCurrency(policy.maxCoverageLimit) : 'بدون حد أقصى'}
                      </span>
                    </div>
                  </div>

                  {policy.expiryDate && (
                    <div className="pt-1.5 border-t border-slate-200/60 dark:border-[#1E293B]/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">تاريخ انتهاء البوليصة:</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {formatDate(policy.expiryDate)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <CustomerInsuranceModal
        customerId={customerId}
        customerName={customerName}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={onRefresh}
      />
    </Card>
  );
};
