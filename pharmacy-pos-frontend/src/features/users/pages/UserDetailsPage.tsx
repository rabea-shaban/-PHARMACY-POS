import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser, useDeactivateUser, useUpdateUser } from '../hooks/useUsers.js';
import { UserRoleBadge } from '../components/UserRoleBadge.js';
import { UserStatusBadge } from '../components/UserStatusBadge.js';
import { ResetPasswordModal } from '../components/ResetPasswordModal.js';
import { UserAuditHistory } from '../components/UserAuditHistory.js';
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
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const UserDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { user: currentUser, role } = useAppSelector((state) => state.auth);

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
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <UserRoleBadge role={user.role} />
              <UserStatusBadge isActive={user.isActive} />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
              معرف الموظف: {user.id}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
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

      {/* Main Profile Info */}
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

        {/* Access & Audit Dates Card */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">الصلاحيات وتواريخ التسجيل</CardTitle>
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
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] text-slate-500 border border-slate-200 dark:border-[#223049]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">تاريخ إنشاء الحساب</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail for this staff */}
      <UserAuditHistory userId={user.id} />

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
