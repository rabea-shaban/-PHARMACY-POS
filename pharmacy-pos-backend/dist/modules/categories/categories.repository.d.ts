import { CategoryQueryFilters } from './categories.types.js';
export declare class CategoriesRepository {
    findMany(filters: CategoryQueryFilters): Promise<{
        items: ({
            _count: {
                products: number;
            };
        } & {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }) | null>;
    findByName(name: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    } | null>;
    create(data: {
        name: string;
        description?: string | null;
    }): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        description?: string | null;
        isActive?: boolean;
    }): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
    softDelete(id: string): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
    }>;
}
export declare const categoriesRepository: CategoriesRepository;
