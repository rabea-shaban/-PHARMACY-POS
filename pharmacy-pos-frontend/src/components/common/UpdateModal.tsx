import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DownloadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ArrowUpCircle,
  Sparkles
} from 'lucide-react';
import type { UpdateInfoPayload, UpdateProgressPayload } from '../../types/electron.js';

export const UpdateModal: React.FC = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfoPayload | null>(null);
  const [progress, setProgress] = useState<UpdateProgressPayload | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (!window.electronAPI?.updater) return;

    // Listen to updater status events
    const unsubStatus = window.electronAPI.updater.onStatus((payload) => {
      setUpdateInfo(payload);

      if (payload.status === 'AVAILABLE') {
        setIsOpen(true);
      } else if (payload.status === 'DOWNLOADED') {
        setIsDownloading(false);
        setIsOpen(true);
      } else if (payload.status === 'ERROR') {
        setIsDownloading(false);
      }
    });

    // Listen to download progress
    const unsubProgress = window.electronAPI.updater.onDownloadProgress((prog) => {
      setProgress(prog);
      setIsDownloading(true);
    });

    return () => {
      unsubStatus();
      unsubProgress();
    };
  }, []);

  const handleStartDownload = async () => {
    if (!window.electronAPI?.updater) return;
    setIsDownloading(true);
    try {
      await window.electronAPI.updater.downloadUpdate();
    } catch (err) {
      setIsDownloading(false);
    }
  };

  const handleInstallAndRestart = () => {
    if (!window.electronAPI?.updater) return;
    window.electronAPI.updater.quitAndInstall();
  };

  if (!isOpen || !updateInfo) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isArabic ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isArabic ? 'تحديث جديد متوفر للنظام' : 'New System Update Available'}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {isArabic ? `الإصدار v${updateInfo.version || '1.0.1'}` : `Version v${updateInfo.version || '1.0.1'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {updateInfo.status === 'AVAILABLE' && !isDownloading && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isArabic 
                  ? 'يتوفر إصدار أحدث من نظام إدارة الصيدليات يتضمن تحسينات في الأداء وميزات جديدة. يمكنك تنزيل التحديث ومتابعة عملك بدون انقطاع.' 
                  : 'A new version of Pharmacy POS is available with performance improvements and new features. You can download the update and continue working smoothly.'}
              </p>

              {updateInfo.releaseNotes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 max-h-32 overflow-y-auto">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                    {isArabic ? 'ملاحظات الإصدار:' : 'Release Notes:'}
                  </span>
                  {updateInfo.releaseNotes}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {isArabic ? 'لاحقاً' : 'Later'}
                </button>
                <button
                  type="button"
                  onClick={handleStartDownload}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <DownloadCloud className="w-4 h-4" />
                  {isArabic ? 'تنزيل التحديث الآن' : 'Download Update Now'}
                </button>
              </div>
            </div>
          )}

          {isDownloading && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                  {isArabic ? 'جاري تنزيل التحديث في الخلفية...' : 'Downloading update in background...'}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {progress ? `${progress.percent}%` : '0%'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress ? progress.percent : 0}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>
                  {progress ? `${formatBytes(progress.transferred)} / ${formatBytes(progress.total)}` : ''}
                </span>
                <span>
                  {progress && progress.bytesPerSecond ? `${formatBytes(progress.bytesPerSecond)}/s` : ''}
                </span>
              </div>

              <p className="text-xs text-slate-400 text-center pt-2">
                {isArabic 
                  ? 'يمكنك الاستمرار في استخدام نقطة البيع بشكل طبيعي أثناء التنزيل.'
                  : 'You can continue using the POS terminal normally while downloading.'}
              </p>
            </div>
          )}

          {updateInfo.status === 'DOWNLOADED' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-100">
                  {isArabic ? 'اكتمل تنزيل التحديث وهو جاهز للتثبيت!' : 'Update downloaded and ready to install!'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isArabic 
                    ? 'سيتم إعادة تشغيل التطبيق لتطبيق الإصدار الجديد تلقائياً دون أي فقد للبيانات.'
                    : 'The application will restart to apply the new version automatically without data loss.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {isArabic ? 'تثبيت عند الإغلاق' : 'Install on Exit'}
                </button>
                <button
                  type="button"
                  onClick={handleInstallAndRestart}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  {isArabic ? 'إعادة التشغيل والتثبيت الآن' : 'Restart & Install Now'}
                </button>
              </div>
            </div>
          )}

          {updateInfo.status === 'ERROR' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {updateInfo.message || (isArabic ? 'حدث خطأ أثناء الاتصال بخادم التحديثات.' : 'Error contacting update server.')}
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
