import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser, useDeactivateUser, useUpdateUser } from '../hooks/useUsers.js';
import { UserRoleBadge } from '../components/UserRoleBadge.js';
import { UserStatusBadge } from '../components/UserStatusBadge.js';
import { ResetPasswordModal } from '../components/ResetPasswordModal.js';
import { UserAuditHistory } from '../components/UserAuditHistory.js';
import { UserPayrollHistory } from '../components/UserPayrollHistory.js';
import { UserSalesPerformance } from '../components/UserSalesPerformance.js';
import { EmployeeCommissionHistory } from '../../commissions/components/EmployeeCommissionHistory.js';
import { Button } from '../../../components/ui/Button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatDate } from '../../../lib/utils.js';
import {
  Phone,
  Mail,
  Calendar,
  Edit,
  Lock,
  ArrowRight,
  ArrowLeft,
  UserX,
  UserCheck,
  ShieldCheck,
  Users,
  Coins,
  Receipt,
  History,
  Clock,
  Award,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

function calculateTenure(createdAtDate: string | Date): string {
  const start = new Date(createdAtDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `منذ ${diffDays} يوم`;
  }
  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;
  if (months < 12) {
    return `منذ ${months} شهر ${remainingDays > 0 ? `و ${remainingDays} يوم` : ''}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `منذ ${years} سنة ${remainingMonths > 0 ? `و ${remainingMonths} شهر` : ''}`;
}

type TabType = 'payroll' | 'commissions' | 'sales' | 'audit';

export const UserDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { user: currentUser, role } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<TabType>('payroll');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const { data: user, isLoading, isError } = useUser(id);
  const deactivateMutation = useDeactivateUser();
  const updateMutation = useUpdateUser();

  const canManage = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const handleToggleStatus = async () => {
    if (!user) return;
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <EmptyState
        icon={Users}
        title="الموظف غير موجود"
        description="لم يتم العثور على سجل الموظف المطلوب."
      />
    );
  }

  const tenureText = calculateTenure(user.createdAt);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/users"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <UserRoleBadge role={user.role} />
              <UserStatusBadge isActive={user.isActive} />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
              <span>معرف: #{user.id.slice(0, 8)}</span>
              <span>•</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1 font-sans">
                <Clock className="w-3.5 h-3.5" />
                مدة العمل: {tenureText}
              </span>
            </div>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsResetPasswordOpen(true)}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              تغيير كلمة المرور
            </Button>

            <Link to={`/users/${user.id}/edit`}>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Edit className="w-4 h-4" />}
              >
                تعديل البيانات
              </Button>
            </Link>

            {currentUser?.id !== user.id && (
              <Button
                variant="outline"
                size="md"
                onClick={handleToggleStatus}
                className={
                  user.isActive
                    ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }
                leftIcon={user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              >
                {user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Profile Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Info Card */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">معلومات الاتصال والحساب</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-[#0B0F17] text-sky-600 border border-slate-200 dark:border-[#223049]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">رقم الهاتف المسجل</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {user.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] text-slate-500 border border-slate-200 dark:border-[#223049]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">البريد الإلكتروني</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {user.email || '— (غير مسجل)'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access & Work Duration Card */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">الصلاحيات والالتحاق بالعمل</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-[#0B0F17] text-purple-600 border border-slate-200 dark:border-[#223049]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">مستوى الوصول الإداري</p>
                <div className="mt-1">
                  <UserRoleBadge role={user.role} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#0B0F17] text-emerald-600 border border-slate-200 dark:border-[#223049]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">تاريخ بدء العمل والالتحاق</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(user.createdAt)} ({tenureText})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation: Payroll Statement vs Commissions vs Sales Performance vs Audit Trail */}
      <div className="border-b border-slate-200 dark:border-[#1E293B] flex items-center gap-2 pt-2 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'payroll'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>كشف الرواتب (Payroll History)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commissions')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'commissions'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>عمولات المبيعات (Sales Commissions)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'sales'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>حركات المبيعات (Sales Performance)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل نشاط النظام (Audit Trail)</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'payroll' && (
          <UserPayrollHistory userId={user.id} userName={user.name} />
        )}
        {activeTab === 'commissions' && (
          <EmployeeCommissionHistory
            userId={user.id}
            userName={user.name}
            userRole={user.role}
          />
        )}
        {activeTab === 'sales' && (
          <UserSalesPerformance userId={user.id} userName={user.name} />
        )}
        {activeTab === 'audit' && <UserAuditHistory userId={user.id} />}
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <ResetPasswordModal
          isOpen={isResetPasswordOpen}
          onClose={() => setIsResetPasswordOpen(false)}
          userId={user.id}
          userName={user.name}
        />
      )}
    </div>
  );
};
