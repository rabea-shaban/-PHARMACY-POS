import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks.js';
import { setUser } from '../store/slices/authSlice.js';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.js';
import { Phone, Lock, Sparkles, HeartPulse } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('01012345678');
  const [password, setPassword] = useState('AdminPass123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', {
        phone: identifier,
        password,
      });

      if (response.data.success && response.data.data.user) {
        dispatch(setUser(response.data.data.user));
        if (response.data.data.user.role === 'PHARMACIST') {
          navigate('/pos');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من صحة البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (rolePhone: string, rolePass: string) => {
    setIdentifier(rolePhone);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-[#F0F6FA] dark:bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden font-cairo">
      {/* Background Decorative Blur Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/50 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/50 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 text-white items-center justify-center shadow-xl shadow-sky-500/25">
            <HeartPulse className="w-9 h-9 text-white animate-pulse" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">صيدلية الأمل الحديثة</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pharmacy POS & Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200/80 dark:border-[#223049] bg-white dark:bg-[#131B2A] shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg">تسجيل الدخول للنظام</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              أدخل رقم الهاتف أو البريد الإلكتروني وكلمة المرور للمتابعة
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="رقم الهاتف أو البريد الإلكتروني"
                type="text"
                placeholder="01012345678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />

              <Input
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full shadow-md" isLoading={isLoading}>
                دخول إلى النظام
              </Button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>حسابات تجريبية سريعة (Seed Demo):</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('01012345678', 'AdminPass123!')}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-[#1E293B] dark:text-slate-200 text-center font-bold transition-colors"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('01123456789', 'PharmPass123!')}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-[#1E293B] dark:text-slate-200 text-center font-bold transition-colors"
                >
                  صيدلي (POS)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('01223456789', 'AccPass123!')}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-[#1E293B] dark:text-slate-200 text-center font-bold transition-colors"
                >
                  محاسب
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
