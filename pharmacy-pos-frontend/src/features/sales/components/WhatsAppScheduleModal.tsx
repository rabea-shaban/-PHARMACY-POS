import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MessageSquare, Copy, ExternalLink, Check, RefreshCw } from 'lucide-react';
import {
  MedicationSchedulePayload,
  formatMedicationScheduleText,
  generateWhatsAppMedicationLink,
} from '../../../lib/medicationSchedule.util.js';

export interface WhatsAppScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: MedicationSchedulePayload;
}

export const WhatsAppScheduleModal: React.FC<WhatsAppScheduleModalProps> = ({
  isOpen,
  onClose,
  payload,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';

  const [phone, setPhone] = useState(payload.customerPhone || '');
  const [lang, setLang] = useState<'ar' | 'en'>(payload.lang || (isAr ? 'ar' : 'en'));
  const [customText, setCustomText] = useState(() =>
    formatMedicationScheduleText({ ...payload, lang: payload.lang || (isAr ? 'ar' : 'en') })
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleLangChange = (newLang: 'ar' | 'en') => {
    setLang(newLang);
    setCustomText(formatMedicationScheduleText({ ...payload, lang: newLang }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!phone) {
      alert(isAr ? 'يرجى إدخال رقم هاتف المريض أولاً' : 'Please enter customer phone number first');
      return;
    }
    const url = generateWhatsAppMedicationLink(phone, customText);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-emerald-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isAr ? 'إرسال جدول الأدوية عبر واتساب' : 'Send Medication Schedule via WhatsApp'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {payload.customerName ? `${isAr ? 'المريض:' : 'Patient:'} ${payload.customerName}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Recipient Phone & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'رقم هاتف المريض (واتساب)' : 'Patient Phone (WhatsApp)'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'لغة الرسالة' : 'Message Language'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLangChange('ar')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    lang === 'ar'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  العربية 🇪🇬
                </button>
                <button
                  type="button"
                  onClick={() => handleLangChange('en')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    lang === 'en'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  English 🇬🇧
                </button>
              </div>
            </div>
          </div>

          {/* Message Preview & Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'معاينة نص الرسالة' : 'Message Preview & Customization'}
              </label>
              <button
                type="button"
                onClick={() => setCustomText(formatMedicationScheduleText({ ...payload, lang }))}
                className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                {isAr ? 'إعادة ضبط' : 'Reset'}
              </button>
            </div>
            <textarea
              rows={11}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ النص' : 'Copy Text'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700 rounded-xl transition"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              <ExternalLink className="w-4 h-4" />
              {isAr ? 'فتح واتساب وإرسال الجدول' : 'Open WhatsApp & Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
