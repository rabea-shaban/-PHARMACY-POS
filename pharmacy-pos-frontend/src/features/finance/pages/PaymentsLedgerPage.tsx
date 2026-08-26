import React, { useState } from 'react';
import { usePayments } from '../hooks/usePayments.js';
import { PaymentsTable } from '../components/PaymentsTable.js';
import { PaymentFilters } from '../components/PaymentFilters.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.js';

export const PaymentsLedgerPage: React.FC = () => {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { data, isLoading } = usePayments({
    page,
    limit: 15,
    saleId: search && search.length === 36 ? search : undefined,
    paymentMethod: (paymentMethod as any) || undefined,
  });

  const payments = data?.items || [];
  const pagination = data?.pagination;

  const handleResetFilters = () => {
    setSearch('');
    setPaymentMethod('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>سجل المعاملات والمدفوعات المالية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            دفتر المعاملات النقدية والإلكترونية لكافة فواتير المبيعات
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/finance">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Landmark className="w-4 h-4" />}
            >
              التقارير المالية
            </Button>
          </Link>

          <Link to="/expenses">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Wallet className="w-4 h-4" />}
            >
              المصروفات
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <PaymentFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Payments Table */}
      {!isLoading && payments.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={CreditCard}
            title="لا توجد عمليات دفع مسجلة"
            description="لم يتم العثور على أي حركات دفع مطابقة لمعايير البحث الحالية."
          />
        </Card>
      ) : (
        <PaymentsTable
          payments={payments}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
