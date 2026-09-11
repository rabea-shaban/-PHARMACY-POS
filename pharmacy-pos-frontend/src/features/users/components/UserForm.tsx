import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getCreateUserSchema,
  getUpdateUserSchema,
} from '../schemas/userSchemas.js';
import { User } from '../types/user.types.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { User as UserIcon, Phone, Mail, Lock, ShieldCheck, Eye, EyeOff, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBranches } from '../../branches/hooks/useBranches.js';
import { Branch } from '../../branches/types/branch.types.js';

export interface UserFormProps {
  initialData?: User;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { data: branchesData, isLoading: isLoadingBranches } = useBranches({ isActive: true, limit: 100 });
  const branches = branchesData?.items || [];

  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? getUpdateUserSchema() : getCreateUserSchema()),
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      role: initialData?.role || 'PHARMACIST',
      branchId: initialData?.branchId || '',
      password: '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const selectedRole = watch('role');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">
            {isEdit ? 'تعديل بيانات وصلاحيات الموظف' : 'بيانات حساب الموظف الجديد'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <Input
              label="اسم الموظف الكامل *"
              placeholder="مثال: د. أحمد سامي"
              error={errors.name?.message ? String(errors.name.message) : undefined}
              {...register('name')}
              leftIcon={<UserIcon className="w-4 h-4 text-sky-600" />}
              autoFocus={!isEdit}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Input
              label="رقم الهاتف الأساسي *"
              placeholder="مثال: 01012345678"
              error={errors.phone?.message ? String(errors.phone.message) : undefined}
              {...register('phone')}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          {/* Email */}
          <div>
            <Input
              type="email"
              label="البريد الإلكتروني (اختياري)"
              placeholder="ahmed@pharmacy.com"
              error={errors.email?.message ? String(errors.email.message) : undefined}
              {...register('email')}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          {/* Role / Permission Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              الصلاحية والدور الإداري (RBAC Role) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <select
                {...register('role')}
                className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-bold"
              >
                <option value="PHARMACIST">دكتور صيدلي (صرف وبيع POS وإرجاع بالفرع)</option>
                <option value="BRANCH_MANAGER">مدير فرع (إشراف كامل على عمليات ومخزون وصيادلة الفرع)</option>
                <option value="PHARMACY_MANAGER">مدير عام الصيدليات (إدارة شاملة لجميع الفروع وسلسلة الصيدليات)</option>
                <option value="ACCOUNTANT">محاسب مالي (التقارير والمشتريات والمصروفات)</option>
                <option value="PLATFORM_MANAGER">مدير منصة (Super Admin - صلاحية فنية وتقنية شاملة)</option>
              </select>
            </div>
            {errors.role?.message && (
              <p className="text-[11px] text-rose-500 mt-1">{String(errors.role.message)}</p>
            )}
          </div>

          {/* Assigned Branch Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                الفرع التابع له الموظف {selectedRole === 'BRANCH_MANAGER' || selectedRole === 'PHARMACIST' ? '*' : '(اختياري)'}
              </label>
              {selectedRole === 'BRANCH_MANAGER' && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  مطلوب لمدير الفرع
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4 text-emerald-600" />
              </div>
              <select
                {...register('branchId')}
                disabled={isLoadingBranches}
                className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">-- بدون تعيين فرع محدد (رؤية عامة / كل الفروع) --</option>
                {branches.map((b: Branch) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
            {errors.branchId?.message && (
              <p className="text-[11px] text-rose-500 mt-1">{String(errors.branchId.message)}</p>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              {selectedRole === 'BRANCH_MANAGER' || selectedRole === 'PHARMACIST'
                ? 'سيتم حصر عمليات البيع والمخزون وتحويلات الأدوية لهذا الموظف على هذا الفرع'
                : 'المدير العام ومدير المنصة يمتلكان صلاحية الإشراف على جميع الفروع تلقائياً'}
            </p>
          </div>

          {/* Password (Required for create, optional for edit) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              {isEdit ? 'كلمة المرور الجديدة (اتركها فارغة إذا لم ترغب في تغييرها)' : 'كلمة المرور للدخول *'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isEdit ? '••••••••' : '٨ أحرف على الأقل'}
                {...register('password')}
                className="w-full rounded-2xl border py-2.5 ps-10 pe-10 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-[11px] text-rose-500 mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          {/* Account Status Switch in Edit Mode */}
          {isEdit && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">حالة نشاط الحساب</p>
                <p className="text-[10px] text-slate-400">
                  عند تعطيل الحساب لن يتمكن الموظف من تسجيل الدخول للنظام
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600" />
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to="/users">
          <Button type="button" variant="outline" size="md">
            {t('common.cancel')}
          </Button>
        </Link>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          {isEdit ? 'حفظ تعديلات الموظف' : 'إنشاء حساب الموظف'}
        </Button>
      </div>
    </form>
  );
};
