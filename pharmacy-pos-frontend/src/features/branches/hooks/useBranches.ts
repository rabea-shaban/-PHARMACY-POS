import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesApi } from '../api/branchesApi.js';
import { BranchQueryParams, BranchFormValues } from '../types/branch.types.js';

export function useBranches(params?: BranchQueryParams) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => branchesApi.getBranches(params),
    staleTime: 60 * 1000,
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: () => branchesApi.getBranchById(id),
    enabled: Boolean(id),
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchFormValues) => branchesApi.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BranchFormValues> }) =>
      branchesApi.updateBranch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches', variables.id] });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchesApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}
