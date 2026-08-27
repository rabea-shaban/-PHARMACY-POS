import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardContent } from '../../../components/ui/Card.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Modal } from '../../../components/ui/Modal.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { showConfirmDialog } from '../../../lib/alerts.js';
import { Tag, Plus, Edit3, Trash2, Search } from 'lucide-react';
import { Category, CategoryFormValues } from '../types/category.types.js';
import { useAppSelector } from '../../../store/hooks.js';

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormValues>({ name: '', description: '' });

  const { data, isLoading } = useCategories({ search: search || undefined });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = data?.items || [];
  const canManage = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (category: Category) => {
    const confirmed = await showConfirmDialog({
      title: t('categories.deleteCategory') || 'حذف التصنيف الدوائي',
      text: t('categories.confirmDeletePrompt', { name: category.name }) || `هل أنت متأكد من رغبتك في حذف التصنيف (${category.name})؟`,
      confirmButtonText: 'نعم، حذف',
      cancelButtonText: 'إلغاء',
      isDanger: true,
    });
    if (confirmed) {
      await deleteMutation.mutateAsync(category.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('categories.pageTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('categories.pageSubtitle')}
          </p>
        </div>

        {canManage && (
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
            {t('categories.addCategory')}
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs max-w-md">
        <Input
          placeholder={t('categories.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Categories Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-3xl h-32 animate-pulse bg-slate-100 dark:bg-[#131B2A]" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Tag}
            title={t('categories.noCategoriesFound')}
            description={t('categories.noCategoriesFoundDesc')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: Category) => (
            <Card key={category.id} className="rounded-3xl shadow-xs hover:shadow-md transition-all">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <Badge variant={category.isActive ? 'success' : 'neutral'}>
                      {category.isActive ? t('products.statusActive') : t('products.statusInactive')}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1E293B] text-xs">
                  <span className="text-slate-400">
                    {category._count?.products || 0} {t('dashboard.itemsUnit')}
                  </span>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(category)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                        title={t('common.edit')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? t('categories.editCategoryTitle') : t('categories.addCategoryTitle')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('categories.fieldName')}
            placeholder={t('categories.fieldNamePlaceholder')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="space-y-1.5 text-start">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {t('categories.fieldDescription')}
            </label>
            <textarea
              rows={3}
              placeholder={t('categories.fieldDescriptionPlaceholder')}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full rounded-2xl border p-3.5 text-sm transition-all bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
