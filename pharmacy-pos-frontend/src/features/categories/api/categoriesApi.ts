import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { Category, CategoryFormValues } from '../types/category.types.js';

export const categoriesApi = {
  getCategories: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<PaginatedResponse<Category>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Category>>>('/categories', { params: { limit: 100, ...params } });
    return response.data.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (data: CategoryFormValues): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Partial<CategoryFormValues>): Promise<Category> => {
    const response = await api.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};
