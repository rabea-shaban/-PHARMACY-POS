import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftRight,
  Plus,
  Truck,
  PackageCheck,
  Eye,
  Building2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { transfersApi } from '../api/transfersApi.js';
import { TransferRequest, TransferStatus } from '../types/transfer.types.js';
import { CreateTransferModal } from '../components/CreateTransferModal.js';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { formatDate } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';

export const TransferRequestsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';
  const { role } = useAppSelector((state) => state.auth);

  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TransferStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const canApprove = role === 'PLATFORM_MANAGER' || role === 'PHARMACY_MANAGER';

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      const res = await transfersApi.getTransfers({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setTransfers(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.error('Failed to load transfers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [page, statusFilter, search]);

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await transfersApi.approveTransfer(id);
      fetchTransfers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve transfer');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDispatch = async (id: string) => {
    if (!window.confirm(isAr ? 'تأكيد خروج الشحنة وخصم الكميات من الفرع المصدر؟' : 'Confirm dispatch and decrement stock from origin branch?')) {
      return;
    }
    try {
      setActionLoadingId(id);
      await transfersApi.dispatchTransfer(id);
      fetchTransfers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to dispatch transfer');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReceive = async (id: string) => {
    if (!window.confirm(isAr ? 'تأكيد استلام الشحنة وإضافتها لمخزون الفرع الوجهة؟' : 'Confirm receipt and add stock to destination branch?')) {
      return;
    }
    try {
      setActionLoadingId(id);
      await transfersApi.receiveTransfer(id);
      fetchTransfers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to receive transfer');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt(isAr ? 'يرجى إدخال سبب رفض طلب التحويل:' : 'Enter rejection reason:');
    if (!reason) return;
    try {
      setActionLoadingId(id);
      await transfersApi.rejectTransfer(id, reason);
      fetchTransfers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject transfer');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من إلغاء طلب التحويل؟' : 'Are you sure you want to cancel this transfer?')) {
      return;
    }
    try {
      setActionLoadingId(id);
      await transfersApi.cancelTransfer(id);
      fetchTransfers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel transfer');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">{isAr ? 'قيد المراجعة' : 'Pending'}</Badge>;
      case 'APPROVED':
        return <Badge variant="info">{isAr ? 'تمت الموافقة' : 'Approved'}</Badge>;
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Truck className="w-3 h-3" />
            {isAr ? 'في الطريق' : 'In Transit'}
          </span>
        );
      case 'COMPLETED':
      case 'RECEIVED':
        return <Badge variant="success">{isAr ? 'مكتمل ومستلم' : 'Completed'}</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">{isAr ? 'مرفوض' : 'Rejected'}</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">{isAr ? 'ملغي' : 'Cancelled'}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? 'تحويلات المخزون بين الفروع' : 'Inter-Branch Stock Transfers'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {isAr
                ? 'إدارة طلبات نقل الأدوية والتشغيلات، الموافقات، والشحن والاستلام'
                : 'Track transfer lifecycle: Pending → Approved → In Transit → Completed'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTransfers()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isAr ? 'طلب تحويل جديد' : 'New Transfer'}
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={isAr ? 'ابحث برقم التحويل، اسم الفرع، أو الملاحظات...' : 'Search transfer #, branch...'}
            className="w-full px-4 py-2.5 ps-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => {
              setStatusFilter('');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === ''
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => {
              setStatusFilter('PENDING');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'PENDING'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isAr ? 'قيد المراجعة' : 'Pending'}
          </button>
          <button
            onClick={() => {
              setStatusFilter('APPROVED');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'APPROVED'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isAr ? 'تمت الموافقة' : 'Approved'}
          </button>
          <button
            onClick={() => {
              setStatusFilter('IN_TRANSIT');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'IN_TRANSIT'
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isAr ? 'في الطريق' : 'In Transit'}
          </button>
          <button
            onClick={() => {
              setStatusFilter('COMPLETED');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === 'COMPLETED'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isAr ? 'مكتمل' : 'Completed'}
          </button>
        </div>
      </div>

      {/* Transfers List */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-700 text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-start">{isAr ? 'رقم التحويل' : 'Transfer #'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'من فرع' : 'From Branch'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'إلى فرع' : 'To Branch'}</th>
                <th className="py-3.5 px-3 text-center">{isAr ? 'الأصناف' : 'Items'}</th>
                <th className="py-3.5 px-3 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-3 text-start">{isAr ? 'تاريخ الطلب' : 'Requested'}</th>
                <th className="py-3.5 px-4 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {isAr ? 'لا توجد طلبات تحويل مطابقة' : 'No transfer requests found'}
                  </td>
                </tr>
              ) : (
                transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    {/* Transfer Number */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          setSelectedTransfer(t);
                          setIsDetailsModalOpen(true);
                        }}
                        className="font-mono font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.transferNumber}</span>
                      </button>
                    </td>

                    {/* From Branch */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{t.fromBranch?.name}</span>
                      </div>
                    </td>

                    {/* To Branch */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{t.toBranch?.name}</span>
                      </div>
                    </td>

                    {/* Items Count */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold font-mono">
                        {t.items?.length || 0} {isAr ? 'صنف' : 'items'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">{getStatusBadge(t.status)}</td>

                    {/* Requested At */}
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      <div>{formatDate(t.requestedAt || t.createdAt)}</div>
                      <div className="text-[10px] text-slate-400">بواسطة: {t.requestedBy?.name || 'Staff'}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* PENDING -> Approve or Reject */}
                        {t.status === 'PENDING' && canApprove && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              isLoading={actionLoadingId === t.id}
                              onClick={() => handleApprove(t.id)}
                              className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                            >
                              {isAr ? 'موافقة' : 'Approve'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={actionLoadingId === t.id}
                              onClick={() => handleReject(t.id)}
                              className="text-[11px] py-1 px-2 text-rose-600 hover:bg-rose-50"
                            >
                              {isAr ? 'رفض' : 'Reject'}
                            </Button>
                          </>
                        )}

                        {/* APPROVED -> Dispatch */}
                        {t.status === 'APPROVED' && (
                          <Button
                            variant="primary"
                            size="sm"
                            isLoading={actionLoadingId === t.id}
                            onClick={() => handleDispatch(t.id)}
                            className="text-[11px] py-1 px-2.5 bg-blue-600 hover:bg-blue-700"
                            leftIcon={<Truck className="w-3 h-3" />}
                          >
                            {isAr ? 'شحن وخروج' : 'Dispatch'}
                          </Button>
                        )}

                        {/* IN_TRANSIT -> Receive */}
                        {t.status === 'IN_TRANSIT' && (
                          <Button
                            variant="primary"
                            size="sm"
                            isLoading={actionLoadingId === t.id}
                            onClick={() => handleReceive(t.id)}
                            className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                            leftIcon={<PackageCheck className="w-3 h-3" />}
                          >
                            {isAr ? 'استلام وتخزين' : 'Receive'}
                          </Button>
                        )}

                        {/* PENDING/APPROVED -> Cancel */}
                        {(t.status === 'PENDING' || t.status === 'APPROVED') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(t.id)}
                            className="text-[11px] py-1 px-2 text-slate-400 hover:text-rose-500"
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTransfer(t);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                          title={isAr ? 'عرض التفاصيل' : 'View Details'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">
              {isAr
                ? `صفحة ${page} من ${totalPages} (${totalCount} تحويل)`
                : `Page ${page} of ${totalPages} (${totalCount} transfers)`}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {isAr ? 'السابق' : 'Previous'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {isAr ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div>
                <h3 className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {selectedTransfer.transferNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedTransfer.fromBranch?.name} ➔ {selectedTransfer.toBranch?.name}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400">{isAr ? 'حالة التحويل:' : 'Status:'} </span>
                  {getStatusBadge(selectedTransfer.status)}
                </div>
                <div className="text-slate-400 text-end">
                  <span>{isAr ? 'طلب بواسطة:' : 'Requested by:'} </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedTransfer.requestedBy?.name}
                  </span>
                </div>
              </div>

              {selectedTransfer.notes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                  <span className="font-bold">{isAr ? 'ملاحظات:' : 'Notes:'} </span>
                  {selectedTransfer.notes}
                </div>
              )}

              {selectedTransfer.rejectionReason && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200">
                  <span className="font-bold">{isAr ? 'سبب الرفض:' : 'Rejection Reason:'} </span>
                  {selectedTransfer.rejectionReason}
                </div>
              )}

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {isAr ? 'قائمة الأصناف المحولة' : 'Transferred Items'}
                </h4>
                <div className="space-y-2">
                  {selectedTransfer.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.product?.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.product?.barcode} {item.batch?.batchNumber ? `• Batch: ${item.batch.batchNumber}` : ''}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-sm px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        {item.quantity} {isAr ? 'وحدة' : 'units'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-100 dark:border-slate-700">
              <Button variant="outline" size="sm" onClick={() => setIsDetailsModalOpen(false)}>
                {isAr ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateTransferModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchTransfers();
          }}
        />
      )}
    </div>
  );
};
