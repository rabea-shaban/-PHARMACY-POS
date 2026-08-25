import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { setCustomer } from '../../../store/slices/cartSlice.js';
import { useCustomerSearch, useCreateCustomerQuick } from '../hooks/useCustomers.js';
import { Customer } from '../../customers/types/customer.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import {
  User,
  UserPlus,
  X,
  Search,
  Award,
} from 'lucide-react';

export const CustomerSelector: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.cart.customer);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick creation state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const { data: searchResults, isLoading: isSearching } = useCustomerSearch(searchQuery);
  const createCustomerMutation = useCreateCustomerQuick();

  const handleSelectCustomer = (cust: Customer) => {
    dispatch(setCustomer(cust));
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const handleQuickCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    try {
      const created = await createCustomerMutation.mutateAsync({
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || null,
        address: newAddress.trim() || null,
      });
      dispatch(setCustomer(created));
      setIsCreateModalOpen(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
    } catch (err: any) {
      alert(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#1E293B] p-3.5 shadow-xs">
      {!customer ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-500 dark:bg-[#1C273B] dark:text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('pos.walkInCustomer') || 'عميل نقدي (بدون تسجيل)'}
              </p>
              <p className="text-[10px] text-slate-400">
                {t('pos.selectCustomerForLoyalty') || 'اختر عميلاً لتطبيق نقاط الولاء أو التأمين'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSearchModalOpen(true)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            >
              {t('common.search')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              {t('pos.newCustomer') || 'جديد'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {customer.name}
                </p>
                {customer.loyalty?.tier && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{customer.loyalty.tier.name}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                <span className="font-mono">{customer.phone}</span>
                {customer.loyalty && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {customer.loyalty.points} {t('pos.pointsUnit') || 'نقطة'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(setCustomer(null))}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title={t('pos.removeCustomer') || 'إلغاء اختيار العميل'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Customer Search Modal */}
      {isSearchModalOpen && (
        <Modal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          title={t('pos.searchCustomerTitle') || 'البحث عن عميل'}
        >
          <div className="space-y-4">
            <Input
              placeholder={t('pos.searchCustomerPlaceholder') || 'ابحث باسم العميل أو رقم الهاتف...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              autoFocus
            />

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1E293B] rounded-2xl border border-slate-100 dark:border-[#1E293B]">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400">{t('common.loading')}</div>
              ) : !searchResults || searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  {searchQuery.trim().length >= 2
                    ? t('pos.noCustomersFound') || 'لم يتم العثور على عملاء'
                    : t('pos.typeToSearchCustomer') || 'اكتب حرفين على الأقل للبحث'}
                </div>
              ) : (
                searchResults.map((cust) => (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => handleSelectCustomer(cust)}
                    className="w-full flex items-center justify-between p-3 hover:bg-sky-50 dark:hover:bg-[#1C273B] text-start transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{cust.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{cust.phone}</p>
                    </div>
                    <div className="text-end text-[11px]">
                      {cust.loyalty && (
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {cust.loyalty.points} {t('pos.pointsUnit') || 'نقطة'}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setIsCreateModalOpen(true);
                }}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                {t('pos.registerNewCustomer') || 'تسجيل عميل جديد'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsSearchModalOpen(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Customer Registration Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={t('pos.quickCreateCustomerTitle') || 'تسجيل عميل جديد سريع'}
        >
          <form onSubmit={handleQuickCreate} className="space-y-4 text-xs">
            <Input
              label={t('customers.fieldName') || 'اسم العميل'}
              placeholder="مثال: أحمد محمود"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              label={t('customers.fieldPhone') || 'رقم الهاتف'}
              placeholder="01012345678"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              required
            />
            <Input
              label={t('customers.fieldEmail') || 'البريد الإلكتروني (اختياري)'}
              type="email"
              placeholder="customer@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Input
              label={t('customers.fieldAddress') || 'العنوان (اختياري)'}
              placeholder="الشارع، المنطقة"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={createCustomerMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={createCustomerMutation.isPending}
              >
                {t('common.save')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
