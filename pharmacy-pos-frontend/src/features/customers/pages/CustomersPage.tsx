import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers.js';
import { useCustomerTiers } from '../hooks/useLoyalty.js';
import { CustomerTable } from '../components/CustomerTable.js';
import { CustomerFilters } from '../components/CustomerFilters.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Users, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const CustomersPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tierId, setTierId] = useState('');
  const [status, setStatus] = useState('');

  const { data: tiers = [] } = useCustomerTiers();

  const { data, isLoading } = useCustomers({
    page,
    limit: 15,
    search: search || undefined,
    tierId: tierId || undefined,
    isActive: status ? status === 'true' : undefined,
  });

  const customers = data?.items || [];
  const pagination = data?.pagination;

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'].includes(role);

  const handleResetFilters = () => {
    setSearch('');
    setTierId('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>إدارة العملاء وبرامج الولاء</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            دليل عملاء الصيدلية، برامج النقاط والمكافآت، وفئات الخصم التراكمية
          </p>
        </div>

        {canCreate && (
          <Link to="/customers/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              تسجيل عميل جديد
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <CustomerFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        tierId={tierId}
        onTierChange={(val) => {
          setTierId(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        tiers={tiers}
        onReset={handleResetFilters}
      />

      {/* Customers Table */}
      {!isLoading && customers.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء مسجلين"
            description="لم يتم العثور على أي عملاء يطابقون خيارات البحث والفلترة."
            action={
              canCreate ? (
                <Link to="/customers/new">
                  <Button variant="primary" size="sm">
                    إضافة عميل جديد
                  </Button>
                </Link>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <CustomerTable
          customers={customers}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
