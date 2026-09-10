import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { Branch, BranchFormValues, BranchQueryParams } from '../types/branch.types.js';

export const branchesApi = {
  getBranches: async (params?: BranchQueryParams): Promise<PaginatedResponse<Branch>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Branch>>>('/branches', { params });
    return response.data.data;
  },

  getBranchById: async (id: string): Promise<Branch> => {
    const response = await api.get<ApiResponse<Branch>>(`/branches/${id}`);
    return response.data.data;
  },

  createBranch: async (data: BranchFormValues): Promise<Branch> => {
    const response = await api.post<ApiResponse<Branch>>('/branches', data);
    return response.data.data;
  },

  updateBranch: async (id: string, data: Partial<BranchFormValues>): Promise<Branch> => {
    const response = await api.patch<ApiResponse<Branch>>(`/branches/${id}`, data);
    return response.data.data;
  },

  deleteBranch: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/branches/${id}`);
  },
};
