import React from 'react';
import { SaleReturn } from '../types/return.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { ReturnReceiptPreview } from './ReturnReceiptPreview.js';
import { CheckCircle2, Printer, PlusCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RefundSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleReturn: SaleReturn;
  onNewReturn: () => void;
}

export const RefundSuccessModal: React.FC<RefundSuccessModalProps> = ({
  isOpen,
  onClose,
  saleReturn,
  onNewReturn,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تم تسجيل استرجاع الأصناف بنجاح!"
    >
      <div className="space-y-4 text-xs">
        {/* Success Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                إشعار إرجاع رقم: {saleReturn.returnNumber}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                تم إعادة الأصناف بنجاح إلى أرصدة المخزن وتشغيلاتها.
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="max-h-80 overflow-y-auto p-2 bg-slate-100 dark:bg-[#0B0F17] rounded-2xl">
          <ReturnReceiptPreview saleReturn={saleReturn} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
          <Link to={`/returns/${saleReturn.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              عرض السند
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              طباعة إيصال الإرجاع
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onNewReturn}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              عملية إرجاع جديدة
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
