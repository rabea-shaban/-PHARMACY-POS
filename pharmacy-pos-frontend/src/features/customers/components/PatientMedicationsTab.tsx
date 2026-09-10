import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pill,
  Clock,
  FileText,
  Plus,
  MessageSquare,
  PowerOff,
} from 'lucide-react';
import { patientMedicationsApi } from '../../patients/api/patientMedicationsApi.js';
import {
  CustomerMedicationsResponse,
  CreatePatientMedicationPayload,
} from '../../patients/types/patientMedication.types.js';
import { productsApi } from '../../products/api/productsApi.js';
import { Product } from '../../products/types/product.types.js';
import { WhatsAppScheduleModal } from '../../sales/components/WhatsAppScheduleModal.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { formatDate } from '../../../lib/utils.js';

export interface PatientMedicationsTabProps {
  customerId: string;
  customerName: string;
  customerPhone: string;
}

export const PatientMedicationsTab: React.FC<PatientMedicationsTabProps> = ({
  customerId,
  customerName,
  customerPhone,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';

  const [medData, setMedData] = useState<CustomerMedicationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'chronic' | 'all' | 'history'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Add Medication Form State
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [newMedType, setNewMedType] = useState<'ACUTE' | 'CHRONIC'>('CHRONIC');
  const [newDosage, setNewDosage] = useState('1 قرص');
  const [newFrequency, setNewFrequency] = useState('مرتين يومياً');
  const [newIsContinuous, setNewIsContinuous] = useState(true);
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const data = await patientMedicationsApi.getCustomerMedications(customerId);
      setMedData(data);
    } catch (err) {
      console.error('Failed to load customer medications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchMedications();
    }
  }, [customerId]);

  const handleSearchProducts = async (q: string) => {
    setSearchProductQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearchingProducts(true);
      const res = await productsApi.searchProducts(q.trim(), 10);
      setSearchResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingProducts(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من إيقاف هذا الدواء للمريض؟' : 'Are you sure you want to deactivate this medication?')) {
      return;
    }
    try {
      await patientMedicationsApi.deactivateMedication(id);
      fetchMedications();
    } catch (err) {
      console.error('Failed to deactivate medication:', err);
    }
  };

  const handleAddMedicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert(isAr ? 'يرجى اختيار الدواء أولاً' : 'Please select a product');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreatePatientMedicationPayload = {
        customerId,
        productId: selectedProduct.id,
        type: newMedType,
        dosage: newDosage,
        frequency: newFrequency,
        dosageTimes: ['08:00 AM', '08:00 PM'],
        duration: newIsContinuous ? null : 'مستمر',
        isContinuous: newIsContinuous,
        doctorNotes: newNotes || null,
        isActive: true,
      };

      await patientMedicationsApi.createMedication(payload);
      setIsAddModalOpen(false);
      setSelectedProduct(null);
      setSearchProductQuery('');
      fetchMedications();
    } catch (err) {
      console.error('Failed to create medication:', err);
      alert(isAr ? 'فشل حفظ الدواء' : 'Failed to save medication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedList =
    activeTab === 'active'
      ? medData?.active || []
      : activeTab === 'chronic'
      ? medData?.chronic || []
      : activeTab === 'history'
      ? medData?.history || []
      : medData?.all || [];

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                {isAr ? 'الملف الدوائي والأدوية المزمنة للمريض' : 'Patient Medication Profile & Chronic Regimen'}
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'متابعة الأدوية الحالية، الجرعات المحددة، ومواعيد التناول'
                  : 'Track active treatments, dosage timetable, and chronic profiles'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWhatsAppModalOpen(true)}
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
            >
              {isAr ? 'إرسال الجدول واتساب' : 'WhatsApp Schedule'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isAr ? 'إضافة دواء' : 'Add Medication'}
            </Button>
          </div>
        </div>

        {/* Quick Stats & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B0F17] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'active'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {isAr ? 'أدوية جارية' : 'Active'} ({medData?.activeCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('chronic')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'chronic'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {isAr ? 'أدوية مزمنة' : 'Chronic'} ({medData?.chronicCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({medData?.totalCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {isAr ? 'السجل السابق' : 'History'} ({medData?.history?.length || 0})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3 py-6">
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        ) : displayedList.length === 0 ? (
          <div className="text-center py-10">
            <Pill className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'لا توجد أدوية مسجلة في هذا القسم' : 'No medications found in this category'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'يمكنك إضافة دواء جديد للمريض أو تسجيله تلقائياً أثناء عمليات البيع.'
                : 'You can add medications manually or attach them during POS checkout.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedList.map((med) => (
              <div
                key={med.id}
                className={`p-4 rounded-2xl border transition-all ${
                  med.isActive
                    ? med.type === 'CHRONIC'
                      ? 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {med.product?.name}
                      </h4>
                      <Badge variant={med.type === 'CHRONIC' ? 'danger' : 'info'}>
                        {med.type === 'CHRONIC' ? (isAr ? 'مزمن' : 'Chronic') : (isAr ? 'عارض' : 'Acute')}
                      </Badge>
                      {!med.isActive && (
                        <Badge variant="neutral">{isAr ? 'متوقف' : 'Stopped'}</Badge>
                      )}
                    </div>
                    {med.product?.scientificName && (
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {med.product.scientificName}
                      </p>
                    )}
                  </div>

                  {med.isActive && (
                    <button
                      onClick={() => handleDeactivate(med.id)}
                      title={isAr ? 'إيقاف الدواء' : 'Stop Medication'}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    >
                      <PowerOff className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {isAr ? 'الجرعة:' : 'Dosage:'}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {med.dosage} {med.dosageUnit || ''}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{med.frequency}</span>
                  </div>

                  {med.dosageTimesList && med.dosageTimesList.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {med.dosageTimesList.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {med.doctorNotes && (
                    <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 text-[11px] mt-2 flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <span>{med.doctorNotes}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <span>
                      {isAr ? 'بواسطة:' : 'By:'} {med.prescribedBy?.name || 'Staff'}
                    </span>
                    <span>{formatDate(med.startDate || med.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'إضافة دواء لملف المريض' : 'Add Medication to Patient Profile'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicationSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Product Picker */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'اختر الدواء من الكتالوج' : 'Select Product from Catalog'}
                </label>
                {selectedProduct ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200">
                    <div>
                      <p className="font-bold">{selectedProduct.name}</p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">{selectedProduct.barcode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      {isAr ? 'تغيير' : 'Change'}
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={searchProductQuery}
                      onChange={(e) => handleSearchProducts(e.target.value)}
                      placeholder={isAr ? 'ابحث باسم الدواء أو الباركود...' : 'Search medicine name or barcode...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {isSearchingProducts && (
                      <p className="text-[11px] text-slate-400 mt-1">{isAr ? 'جاري البحث...' : 'Searching...'}</p>
                    )}
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl divide-y divide-slate-100 dark:divide-slate-700">
                        {searchResults.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p);
                              setSearchResults([]);
                            }}
                            className="w-full p-2.5 text-start hover:bg-slate-50 dark:hover:bg-slate-700 text-xs flex justify-between items-center"
                          >
                            <span className="font-bold">{p.name}</span>
                            <span className="text-slate-400 text-[11px]">{p.sellingPrice} EGP</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Classification */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNewMedType('ACUTE');
                    setNewIsContinuous(false);
                  }}
                  className={`p-2.5 rounded-xl border font-bold text-center transition ${
                    newMedType === 'ACUTE'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  {isAr ? 'علاج عرضي' : 'Acute'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewMedType('CHRONIC');
                    setNewIsContinuous(true);
                  }}
                  className={`p-2.5 rounded-xl border font-bold text-center transition ${
                    newMedType === 'CHRONIC'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  {isAr ? 'علاج مزمن' : 'Chronic'}
                </button>
              </div>

              {/* Dosage & Frequency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">{isAr ? 'الجرعة' : 'Dosage'}</label>
                  <input
                    type="text"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{isAr ? 'التكرار' : 'Frequency'}</label>
                  <input
                    type="text"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Doctor Notes */}
              <div>
                <label className="block font-semibold mb-1">{isAr ? 'ملاحظات الصيدلي / الطبيب' : 'Notes'}</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={isAr ? 'ملاحظات خاصة بالتناول...' : 'Instructions...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                  {isAr ? 'حفظ الدواء' : 'Save Medication'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && (
        <WhatsAppScheduleModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          payload={{
            customerName,
            customerPhone,
            items: (medData?.active || []).map((m) => ({
              productName: m.product?.name || 'دواء',
              scientificName: m.product?.scientificName,
              type: m.type,
              dosage: m.dosage,
              dosageUnit: m.dosageUnit,
              frequency: m.frequency,
              dosageTimes: m.dosageTimesList,
              duration: m.duration,
              isContinuous: m.isContinuous,
              doctorNotes: m.doctorNotes,
            })),
          }}
        />
      )}
    </Card>
  );
};
