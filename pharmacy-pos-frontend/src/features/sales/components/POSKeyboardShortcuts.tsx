import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Keyboard } from 'lucide-react';

export interface POSKeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const POSKeyboardShortcuts: React.FC<POSKeyboardShortcutsProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const shortcuts = [
    { key: 'F1', desc: 'التركيز على شريط البحث عن الأدوية' },
    { key: 'F2', desc: 'التركيز على قارئ الباركود السريع' },
    { key: 'F3', desc: 'فتح نافذة اختيار أو تسجيل عميل' },
    { key: 'F4', desc: 'إضافة خصم أو كوبون للفاتورة' },
    { key: 'F8', desc: 'فتح نافذة الدفع وإصدار الفاتورة (Checkout)' },
    { key: 'F9', desc: 'طباعة الإيصال الحراري للفاتورة' },
    { key: 'Esc', desc: 'إغلاق النوافذ المنبثقة أو بدء فاتورة جديدة' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pos.shortcutsTitle') || 'اختصارات لوحة المفاتيح للكاشير'}
    >
      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 flex items-center gap-2 text-sky-800 dark:text-sky-200 font-bold">
          <Keyboard className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>تم تصميم نقطة البيع لتعمل بالكامل عبر لوحة المفاتيح لسرعة خدمة العملاء.</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1E293B] rounded-2xl border border-slate-100 dark:border-[#1E293B] overflow-hidden">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between p-2.5">
              <span className="text-slate-600 dark:text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 font-mono font-bold text-xs border border-slate-200 dark:border-[#2A3B56] shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
