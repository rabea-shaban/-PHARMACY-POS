import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Card, CardContent } from '../components/ui/Card.js';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.js';
import { getDefaultRouteForRole } from '../config/permissions.js';

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAppSelector((state) => state.auth);
  const { direction } = useAppSelector((state) => state.ui);

  const handleReturn = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(getDefaultRouteForRole(role));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-rose-200/80 dark:border-rose-900/40 text-center rounded-3xl shadow-xl">
        <CardContent className="p-8 space-y-5">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/15">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {t('common.unauthorized')} (403)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('common.unauthorizedDesc')}
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleReturn}
              leftIcon={direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            >
              {direction === 'rtl' ? 'العودة للرئيسية' : 'Return to Home'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
