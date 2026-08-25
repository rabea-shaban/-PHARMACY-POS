import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks.js';
import { setUser } from '../store/slices/authSlice.js';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.js';
import { Phone, Lock, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#EAF7F7] flex items-center justify-center p-4 relative overflow-hidden font-cairo">
      {/* Background Decorative Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#83D4C8]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#CBEF91]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-[#003C3D] text-white items-center justify-center text-3xl shadow-xl shadow-[#003C3D]/20">
            🏥
          </div>
          <h1 className="text-2xl font-black text-[#0B3031] tracking-tight">صيدلية الأمل الحديثة</h1>
          <p className="text-xs text-[#557274]">Pharmacy POS & Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-[#D5E6E5] bg-[#F7FCFC] shadow-2xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-[#0B3031] text-lg">تسجيل الدخول للنظام</CardTitle>
            <CardDescription className="text-[#557274]">
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
                <div className="p-3 rounded-2xl bg-[#FDEBEC] border border-[#F8D7DA] text-[#842029] text-xs font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                دخول إلى النظام
              </Button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-[#D5E6E5]">
              <div className="flex items-center gap-1.5 text-xs text-[#557274] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#003C3D]" />
                <span>حسابات تجريبية سريعة (Seed Demo):</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('01012345678', 'AdminPass123!')}
                  className="p-2 rounded-xl bg-[#DDEEEE] hover:bg-[#cbe6e6] text-[#003C3D] text-center font-bold transition-colors"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('01123456789', 'PharmPass123!')}
                  className="p-2 rounded-xl bg-[#DDEEEE] hover:bg-[#cbe6e6] text-[#003C3D] text-center font-bold transition-colors"
                >
                  صيدلي (POS)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('01223456789', 'AccPass123!')}
                  className="p-2 rounded-xl bg-[#DDEEEE] hover:bg-[#cbe6e6] text-[#003C3D] text-center font-bold transition-colors"
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
