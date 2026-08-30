import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sale } from '../types/sale.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { ReceiptPreview } from './ReceiptPreview.js';
import { CheckCircle2, Printer, PlusCircle, ExternalLink, Check, AlertCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { printSaleReceipt, isDirectPrintSupported } from '../../../lib/printer.js';
import { openWhatsAppInvoice } from '../../../lib/whatsapp.js';
import { showPromptDialog } from '../../../lib/alerts.js';
import { useAppSelector } from '../../../store/hooks.js';

export interface InvoiceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  onNewSale: () => void;
}

export const InvoiceSuccessModal: React.FC<InvoiceSuccessModalProps> = ({
  isOpen,
  onClose,
  sale,
  onNewSale,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const { publicSettings } = useAppSelector((state) => state.settings);
  const [printStatus, setPrintStatus] = React.useState<'idle' | 'printing' | 'success' | 'error'>('idle');
  const [printMessage, setPrintMessage] = React.useState<string>('');

  const handlePrint = async () => {
    setPrintStatus('printing');
    try {
      const result = await printSaleReceipt(sale, {
        pharmacyName: publicSettings.pharmacyName,
        pharmacySlogan: publicSettings.pharmacySlogan,
        pharmacyPhone: publicSettings.pharmacyPhone,
        pharmacyAddress: publicSettings.pharmacyAddress,
        receiptFooterText: publicSettings.receiptFooterText,
        receiptReturnPolicy: publicSettings.receiptReturnPolicy,
      });

      if (result.success) {
        setPrintStatus('success');
        setPrintMessage(isArabic ? 'تمت طباعة الإيصال بنجاح' : 'Receipt printed successfully');
      } else {
        setPrintStatus('error');
        setPrintMessage(result.error || (isArabic ? 'تعذر الطباعة المباشرة' : 'Direct print failed'));
      }
    } catch (err: any) {
      setPrintStatus('error');
      setPrintMessage(err.message || 'Print error');
    }
  };

  const handleWhatsApp = async () => {
    let phone = sale.customerPhone?.trim();
    if (!phone) {
      const inputPhone = await showPromptDialog({
        title: isArabic ? 'إرسال الفاتورة عبر واتساب' : 'Send Invoice via WhatsApp',
        text: isArabic
          ? 'العميل لا يملك رقماً مسجلاً. أدخل رقم هاتف العميل (أو اتركه فارغاً لاختيار المحادثة مباشرة):'
          : 'Customer has no recorded phone. Enter phone number (or leave blank to select in WhatsApp):',
        placeholder: '010XXXXXXXX',
        confirmButtonText: isArabic ? 'فتح واتساب' : 'Open WhatsApp',
        cancelButtonText: isArabic ? 'إلغاء' : 'Cancel',
        inputValidator: () => null,
      });
      if (inputPhone === null) return;
      phone = inputPhone.trim();
    }

    openWhatsAppInvoice(
      sale,
      {
        pharmacyName: publicSettings.pharmacyName,
        pharmacySlogan: publicSettings.pharmacySlogan,
        pharmacyPhone: publicSettings.pharmacyPhone,
        pharmacyAddress: publicSettings.pharmacyAddress,
      },
      phone || undefined
    );
  };

  // Auto-print receipt on invoice creation if direct print is enabled
  React.useEffect(() => {
    if (isOpen && sale && isDirectPrintSupported() && localStorage.getItem('pos_direct_print') !== 'false') {
      handlePrint();
    }
  }, [isOpen, sale?.id]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pos.invoiceCompletedTitle') || 'تم إصدار الفاتورة بنجاح!'}
    >
      <div className="space-y-4">
        {/* Success Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                فاتورة رقم: {sale.invoiceNumber}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                تم خصم الكميات من المخزون بنظام FEFO وتسجيل التحصيل المالي.
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="max-h-96 overflow-y-auto p-2 bg-slate-100 dark:bg-[#0B0F17] rounded-2xl">
          <ReceiptPreview sale={sale} />
        </div>

        {printStatus === 'error' && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{printMessage}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
          <Link to={`/sales/${sale.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              {t('common.view')} الفاتورة
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800"
              leftIcon={<MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            >
              {isArabic ? 'واتساب' : 'WhatsApp'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              isLoading={printStatus === 'printing'}
              leftIcon={
                printStatus === 'success' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : printStatus === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Printer className="w-3.5 h-3.5" />
                )
              }
            >
              {printStatus === 'printing'
                ? (isArabic ? 'جاري الطباعة...' : 'Printing...')
                : printStatus === 'success'
                ? (isArabic ? 'إعادة الطباعة (F9)' : 'Reprint (F9)')
                : (t('pos.printReceipt') || 'طباعة الإيصال (F9)')}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onNewSale}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              {t('pos.startNewSale') || 'فاتورة بيع جديدة (Esc)'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
