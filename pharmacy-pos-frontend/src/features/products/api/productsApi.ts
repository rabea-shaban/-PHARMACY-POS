import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import { Product, ProductStockSummary, ProductBatch, ProductQueryParams } from '../types/product.types.js';
import { ProductFormValues } from '../schemas/productSchemas.js';

export const productsApi = {
  // 1. List / search products with filters and pagination
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data.data;
  },

  // 2. Search products (POS optimized)
  searchProducts: async (query: string, limit = 20): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/search', {
      params: { q: query, limit },
    });
    return response.data.data;
  },

  // 3. Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // 3b. Fast barcode lookup
  getProductByBarcode: async (barcode: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/barcode/${barcode}`);
    return response.data.data;
  },

  // 4. Get product stock summary
  getProductStock: async (id: string): Promise<ProductStockSummary> => {
    const response = await api.get<ApiResponse<ProductStockSummary>>(`/products/${id}/stock`);
    return response.data.data;
  },

  // 5. Get product batches
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    const response = await api.get<ApiResponse<ProductBatch[]>>(`/products/${productId}/batches`);
    return response.data.data;
  },

  // 6. Create product
  createProduct: async (data: ProductFormValues): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  // 7. Update product
  updateProduct: async (id: string, data: Partial<ProductFormValues>): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  // 8. Delete / Deactivate product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/products/${id}`);
  },
};
