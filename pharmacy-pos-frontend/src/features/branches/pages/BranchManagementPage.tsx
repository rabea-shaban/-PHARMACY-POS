import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Star,
  Search,
} from 'lucide-react';
import { branchesApi } from '../api/branchesApi.js';
import { Branch, BranchFormValues } from '../types/branch.types.js';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { useAppSelector } from '../../../store/hooks.js';

export const BranchManagementPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';
  const { role } = useAppSelector((state) => state.auth);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canManage = role === 'PLATFORM_MANAGER' || role === 'PHARMACY_MANAGER';

  const loadBranches = async () => {
    try {
      setIsLoading(true);
      const res = await branchesApi.getBranches({ search: search.trim() || undefined, limit: 100 });
      setBranches(res.items);
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingBranch(null);
    setName('');
    setCode('');
    setAddress('');
    setPhone('');
    setIsMain(false);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setEditingBranch(b);
    setName(b.name);
    setCode(b.code);
    setAddress(b.address || '');
    setPhone(b.phone || '');
    setIsMain(b.isMain);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload: BranchFormValues = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        address: address.trim() || null,
        phone: phone.trim() || null,
        isMain,
      };

      if (editingBranch) {
        await branchesApi.updateBranch(editingBranch.id, payload);
      } else {
        await branchesApi.createBranch(payload);
      }

      setIsModalOpen(false);
      loadBranches();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(isAr ? `هل أنت متأكد من تعطيل فرع "${name}"؟` : `Are you sure you want to deactivate branch "${name}"?`)) {
      return;
    }
    try {
      await branchesApi.deleteBranch(id);
      loadBranches();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to deactivate branch');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? 'إدارة فروع الصيدلية' : 'Branch Management'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {isAr
                ? 'إدارة شبكة الفروع، المقر الرئيسي، والمواقع التشغيلية'
                : 'Manage pharmacy branches, main headquarters, and operational locations'}
            </p>
          </div>
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isAr ? 'إضافة فرع جديد' : 'Add New Branch'}
          </Button>
        )}
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'ابحث باسم الفرع أو الكود أو العنوان...' : 'Search branch name, code, address...'}
          className="w-full px-4 py-2.5 ps-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
      </div>

      {/* Branches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {isAr ? 'لم يتم العثور على فروع' : 'No branches found'}
          </h3>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map((b) => (
            <div
              key={b.id}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                b.isMain
                  ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 border-blue-200 dark:border-blue-900/50 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              {b.isMain && (
                <div className="absolute top-0 end-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                  {isAr ? 'الفرع الرئيسي' : 'Main Branch'}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {b.code}
                  </span>
                  <Badge variant={b.isActive ? 'success' : 'neutral'}>
                    {b.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {b.name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {b.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.address}</span>
                    </div>
                  )}
                  {b.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{b.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Branch Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-center text-xs mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400">{isAr ? 'الموظفين' : 'Staff'}</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {b._count?.users || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">{isAr ? 'التشغيلات' : 'Batches'}</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {b._count?.batches || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">{isAr ? 'المبيعات' : 'Sales'}</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {b._count?.sales || 0}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                {canManage && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>

                    {!b.isMain && b.isActive && (
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تعطيل' : 'Deactivate'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingBranch
                  ? isAr
                    ? 'تعديل بيانات الفرع'
                    : 'Edit Branch Details'
                  : isAr
                  ? 'إضافة فرع جديد'
                  : 'Add New Branch'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">{isAr ? 'اسم الفرع' : 'Branch Name'}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: فرع مدينة نصر' : 'e.g. Nasr City Branch'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{isAr ? 'كود الفرع (فريد)' : 'Branch Code (Unique)'}</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="BR-02"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{isAr ? 'العنوان' : 'Address'}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isAr ? 'شارع عباس العقاد، القاهرة' : 'Address details'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMain}
                    onChange={(e) => setIsMain(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold">{isAr ? 'تعيين كمقر رئيسي (Main Pharmacy)' : 'Set as Main Headquarters'}</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                  {isAr ? 'حفظ الفرع' : 'Save Branch'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
