import { ProductsRepository } from './products.repository.js';
import { CategoriesService } from '../categories/categories.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateProductDTO, UpdateProductDTO } from './products.validator.js';
import { ProductResponse, ProductQueryFilters, ProductSearchQueryFilters, PaginatedProductsResponse, LowStockProductItem, ExpiringProductItem, ProductStockSummaryResponse } from './products.types.js';
export declare class ProductsService {
    private readonly repo;
    private readonly categories;
    private readonly audit;
    constructor(repo?: ProductsRepository, categories?: CategoriesService, audit?: AuditService);
    getProducts(filters: ProductQueryFilters): Promise<PaginatedProductsResponse>;
    searchProducts(filters: ProductSearchQueryFilters): Promise<ProductResponse[]>;
    getProductById(id: string): Promise<ProductResponse>;
    getProductByBarcode(barcode: string): Promise<ProductResponse>;
    getProductStockSummary(id: string, expiringHorizonDays?: number): Promise<ProductStockSummaryResponse>;
    createProduct(input: CreateProductDTO, actorId?: string): Promise<ProductResponse>;
    updateProduct(id: string, input: UpdateProductDTO, actorId?: string): Promise<ProductResponse>;
    deleteProduct(id: string, actorId?: string): Promise<ProductResponse>;
    getLowStockProducts(): Promise<LowStockProductItem[]>;
    getExpiringProducts(daysAhead?: number): Promise<ExpiringProductItem[]>;
}
export declare const productsService: ProductsService;
