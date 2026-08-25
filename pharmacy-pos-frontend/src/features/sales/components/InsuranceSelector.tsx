import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { setInsurance } from '../../../store/slices/cartSlice.js';
import { useCustomerInsurances } from '../hooks/useCustomers.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { ShieldCheck, X } from 'lucide-react';

export const InsuranceSelector: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.cart.customer);
  const appliedInsurance = useAppSelector((state) => state.cart.insurance);

  const [isOpen, setIsOpen] = useState(false);
  const { data: policies, isLoading } = useCustomerInsurances(customer?.id);

  if (!customer) return null;

  return (
    <>
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17]/60 border border-slate-100 dark:border-[#1E293B] text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/80 dark:text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-200 block truncate">
              {appliedInsurance
                ? `${appliedInsurance.providerName} (${appliedInsurance.coveragePercentage}%)`
                : t('pos.noInsuranceApplied') || 'تأمين طبي (غير مفعل)'}
            </span>
          </div>
        </div>

        {appliedInsurance ? (
          <button
            type="button"
            onClick={() => dispatch(setInsurance(null))}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="إلغاء التأمين"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold hover:bg-teal-200 transition-colors cursor-pointer text-[11px]"
          >
            {t('pos.selectInsurance') || 'اختيار بوليصة'}
          </button>
        )}
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={t('pos.customerInsuranceTitle') || 'بوالص التأمين الصحي للعميل'}
        >
          <div className="space-y-3 text-xs">
            {isLoading ? (
              <div className="p-4 text-center text-slate-400">{t('common.loading')}</div>
            ) : !policies || policies.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                {t('pos.noCustomerPolicies') || 'لا توجد بوالص تأمين مسجلة لهذا العميل.'}
              </div>
            ) : (
              <div className="space-y-2">
                {policies.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      dispatch(
                        setInsurance({
                          policyId: p.id,
                          providerName: p.providerName,
                          coveragePercentage: p.coveragePercentage,
                        })
                      );
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-teal-50 dark:hover:bg-teal-950/40 text-start transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{p.providerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        رقم البوليصة: {p.policyNumber}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className="font-black text-teal-600 dark:text-teal-400 text-sm">
                        تغطية {p.coveragePercentage}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
