import React, { useState } from 'react';
import { useUsers, useDeactivateUser, useUpdateUser } from '../hooks/useUsers.js';
import { UserTable } from '../components/UserTable.js';
import { UserFilters } from '../components/UserFilters.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { User } from '../types/user.types.js';
import { Users, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const UsersPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useUsers({
    page,
    limit: 15,
    search: search || undefined,
    role: (selectedRole as any) || undefined,
    isActive: status ? status === 'true' : undefined,
  });

  const deactivateMutation = useDeactivateUser();
  const updateMutation = useUpdateUser();

  const users = data?.items || [];
  const pagination = data?.pagination;

  const canManage = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedRole('');
    setStatus('');
    setPage(1);
  };

  const handleToggleStatus = async (user: User) => {
    if (user.isActive) {
      if (
        window.confirm(
          `هل أنت متأكد من رغبتك في تعطيل حساب الموظف (${user.name})؟ لن يتمكن من تسجيل الدخول للنظام.`
        )
      ) {
        await deactivateMutation.mutateAsync(user.id);
      }
    } else {
      if (window.confirm(`هل ترغب في إعادة تفعيل حساب الموظف (${user.name})؟`)) {
        await updateMutation.mutateAsync({
          id: user.id,
          data: { isActive: true },
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>إدارة الموظفين والصلاحيات (Staff Management)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            دليل حسابات الصيادلة، مدراء الصيدلية، المحاسبين، والتحكم في صلاحيات الوصول (RBAC)
          </p>
        </div>

        {canManage && (
          <Link to="/users/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              إضافة موظف جديد
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <UserFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        role={selectedRole}
        onRoleChange={(val) => {
          setSelectedRole(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Users Table */}
      {!isLoading && users.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Users}
            title="لا يوجد موظفون مسجلون"
            description="لم يتم العثور على أي حسابات موظفين تطابق خيارات البحث الحالية."
            action={
              canManage ? (
                <Link to="/users/new">
                  <Button variant="primary" size="sm">
                    إضافة موظف جديد
                  </Button>
                </Link>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <UserTable
          users={users}
          isLoading={isLoading}
          onToggleStatus={handleToggleStatus}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
