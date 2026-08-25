import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getLoginSchema, LoginFormValues } from '../schemas/authSchemas.js';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../../../components/ui/Button.js';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

export interface LoginFormProps {
  onQuickFillSet?: (setter: (identifier: string, pass: string) => void) => void;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const { t } = useTranslation();
  const { login, isLoggingIn, loginError, setLoginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema()),
    defaultValues: {
      identifier: '01012345678',
      password: 'AdminPass123!',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch {
      // Error handled inside useAuth state
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start" noValidate>
      {/* Global / Server Error Message */}
      {loginError && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold animate-in fade-in"
        >
          {loginError}
        </div>
      )}

      {/* Identifier Field (Phone / Email) */}
      <div className="space-y-1.5">
        <label
          htmlFor="auth-identifier"
          className="block text-xs font-bold text-slate-700 dark:text-slate-200"
        >
          {t('auth.identifierLabel')}
        </label>
        <div className="relative rounded-2xl">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Phone className="w-4 h-4" />
          </div>
          <input
            id="auth-identifier"
            type="text"
            autoComplete="username"
            placeholder={t('auth.identifierLabel')}
            aria-invalid={errors.identifier ? 'true' : 'false'}
            aria-describedby={errors.identifier ? 'identifier-error' : undefined}
            disabled={isLoggingIn}
            className={cn(
              'block w-full rounded-2xl border py-2.5 ps-10 pe-4 text-sm transition-all',
              'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400',
              'dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 dark:placeholder:text-slate-500',
              'focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none dark:focus:border-sky-400',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.identifier && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
            )}
            {...register('identifier', {
              onChange: () => {
                if (loginError) setLoginError(null);
              },
            })}
          />
        </div>
        {errors.identifier && (
          <p id="identifier-error" className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
            {errors.identifier.message}
          </p>
        )}
      </div>

      {/* Password Field with Show/Hide Toggle */}
      <div className="space-y-1.5">
        <label
          htmlFor="auth-password"
          className="block text-xs font-bold text-slate-700 dark:text-slate-200"
        >
          {t('auth.passwordLabel')}
        </label>
        <div className="relative rounded-2xl">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={isLoggingIn}
            className={cn(
              'block w-full rounded-2xl border py-2.5 ps-10 pe-11 text-sm transition-all',
              'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400',
              'dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 dark:placeholder:text-slate-500',
              'focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none dark:focus:border-sky-400',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.password && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
            )}
            {...register('password', {
              onChange: () => {
                if (loginError) setLoginError(null);
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-sky-600/25 mt-2"
        isLoading={isLoggingIn}
      >
        {isLoggingIn ? t('auth.loggingIn') : t('auth.loginButton')}
      </Button>

      {/* Quick Fill Dispatcher helper */}
      <div className="hidden">
        <button
          type="button"
          id="btn-quick-fill"
          onClick={(e: any) => {
            const { id, pass } = e.currentTarget.dataset;
            if (id) setValue('identifier', id, { shouldValidate: true });
            if (pass) setValue('password', pass, { shouldValidate: true });
          }}
        />
      </div>
    </form>
  );
};
