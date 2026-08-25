import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.js';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 font-cairo">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-850 dark:text-slate-100">404</h1>
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-2">الصفحة غير موجودة</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        عفواً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
};
