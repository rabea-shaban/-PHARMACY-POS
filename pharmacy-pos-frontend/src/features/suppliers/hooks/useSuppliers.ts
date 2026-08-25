import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi } from '../api/suppliersApi.js';
import { SupplierQueryParams, SupplierFormValues } from '../types/supplier.types.js';

export function useSuppliers(params?: SupplierQueryParams) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => suppliersApi.getSuppliers(params),
    staleTime: 60 * 1000,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => suppliersApi.getSupplierById(id),
    enabled: Boolean(id),
  });
}

export function useSupplierPurchases(id: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['supplier-purchases', id, params],
    queryFn: () => suppliersApi.getSupplierPurchases(id, params),
    enabled: Boolean(id),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierFormValues) => suppliersApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierFormValues> }) =>
      suppliersApi.updateSupplier(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suppliersApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}
