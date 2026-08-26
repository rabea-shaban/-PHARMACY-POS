import { CategoriesRepository } from './categories.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.validator.js';
import { CategoryResponse, CategoryQueryFilters, PaginatedCategoriesResponse } from './categories.types.js';
export declare class CategoriesService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: CategoriesRepository, audit?: AuditService);
    getCategories(filters: CategoryQueryFilters): Promise<PaginatedCategoriesResponse>;
    getCategoryById(id: string): Promise<CategoryResponse>;
    createCategory(input: CreateCategoryDTO, actorId?: string): Promise<CategoryResponse>;
    updateCategory(id: string, input: UpdateCategoryDTO, actorId?: string): Promise<CategoryResponse>;
    deleteCategory(id: string, actorId?: string): Promise<CategoryResponse>;
}
export declare const categoriesService: CategoriesService;
