import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser, useUpdateUser } from '../hooks/useUsers.js';
import { UserForm } from '../components/UserForm.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Edit, ArrowRight, ArrowLeft, AlertCircle, Users } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const EditUserPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { direction } = useAppSelector((state) => state.ui);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user, isLoading: isLoadingUser, isError } = useUser(id);
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    try {
      await updateUserMutation.mutateAsync({
        id,
        data: {
          name: values.name,
          phone: values.phone,
          email: values.email || null,
          password: values.password || undefined,
          role: values.role,
          isActive: values.isActive,
        },
      });

      navigate(`/users/${id}`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  if (isLoadingUser) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
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
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <Link
          to={`/users/${id}`}
          className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
        >
          {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Edit className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>تعديل حساب وصلاحيات ({user.name})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحديث رقم الهاتف، البريد، الصلاحية، وحالة الحساب
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* User Form */}
      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
        isLoading={updateUserMutation.isPending}
      />
    </div>
  );
};
