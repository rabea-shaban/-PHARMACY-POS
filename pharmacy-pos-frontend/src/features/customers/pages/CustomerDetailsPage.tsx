import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer, useCustomerPurchases } from '../hooks/useCustomers.js';
import { useCustomerLoyalty, useLoyaltyTransactions, useCustomerTiers } from '../hooks/useLoyalty.js';
import { CustomerTierBadge } from '../components/CustomerTierBadge.js';
import { CustomerLoyaltyCard } from '../components/CustomerLoyaltyCard.js';
import { LoyaltyProgress } from '../components/LoyaltyProgress.js';
import { LoyaltyTransactionsTable } from '../components/LoyaltyTransactionsTable.js';
import { CustomerPurchaseHistory } from '../components/CustomerPurchaseHistory.js';
import { AdjustPointsModal } from '../components/AdjustPointsModal.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Button } from '../../../components/ui/Button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatDate } from '../../../lib/utils.js';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const CustomerDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const { data: customer, isLoading: isLoadingCustomer, isError } = useCustomer(id);
  const { data: tiers = [] } = useCustomerTiers();
  const { data: loyaltySummary } = useCustomerLoyalty(id);
  const { data: transactionsData, isLoading: isLoadingTransactions } = useLoyaltyTransactions(id);
  const { data: purchasesData, isLoading: isLoadingPurchases } = useCustomerPurchases(id);

  const canEdit = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  if (isLoadingCustomer) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
          <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse md:col-span-2" />
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <EmptyState
        icon={Users}
        title="العميل غير موجود"
        description="لم يتم العثور على سجل العميل المطلوب."
      />
    );
  }

  const transactions = transactionsData?.items || loyaltySummary?.recentTransactions || [];
  const purchases = purchasesData?.items || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/customers"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {customer.name}
              </h1>
              <CustomerTierBadge tier={customer.tier} />
              {customer.isActive ? (
                <Badge variant="success">نشط</Badge>
              ) : (
                <Badge variant="neutral">معطل</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              عميل مسجل منذ: {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/pos">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              فتح فاتورة بيع جديدة
            </Button>
          </Link>

          {canEdit && (
            <Link to={`/customers/${customer.id}/edit`}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Edit className="w-4 h-4" />}
              >
                تعديل البيانات
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Grid: Profile Info & Loyalty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">معلومات الملف الشخصي</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">رقم الهاتف الأساسي</p>
                <p className="font-mono font-bold text-sm">{customer.phone}</p>
              </div>
            </div>

            {customer.email && (
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">البريد الإلكتروني</p>
                  <p className="font-bold">{customer.email}</p>
                </div>
              </div>
            )}

            {customer.address && (
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">العنوان</p>
                  <p className="font-bold">{customer.address}</p>
                </div>
              </div>
            )}

            {customer.dateOfBirth && (
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">تاريخ الميلاد</p>
                  <p className="font-bold">{customer.dateOfBirth.slice(0, 10)}</p>
                </div>
              </div>
            )}

            {customer.notes && (
              <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
                <p className="text-[10px] text-slate-400 mb-1">ملاحظات العميل الخاصة</p>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] text-slate-600 dark:text-slate-300 italic">
                  {customer.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loyalty & Tier Highlights */}
        <div className="md:col-span-2 space-y-6">
          <CustomerLoyaltyCard
            loyaltySummary={loyaltySummary}
            tier={customer.tier}
            onOpenAdjustModal={() => setIsAdjustModalOpen(true)}
          />

          <LoyaltyProgress
            currentPoints={loyaltySummary?.loyaltyAccount?.totalPoints || 0}
            currentTier={customer.tier}
            allTiers={tiers}
          />
        </div>
      </div>

      {/* Tables: Purchases and Loyalty Points History */}
      <div className="space-y-6">
        <CustomerPurchaseHistory
          purchases={purchases}
          isLoading={isLoadingPurchases}
        />

        <LoyaltyTransactionsTable
          transactions={transactions}
          isLoading={isLoadingTransactions}
        />
      </div>

      {/* Adjust Points Dialog */}
      {isAdjustModalOpen && (
        <AdjustPointsModal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          customerId={customer.id}
          customerName={customer.name}
          currentPoints={loyaltySummary?.loyaltyAccount?.totalPoints || 0}
        />
      )}
    </div>
  );
};
