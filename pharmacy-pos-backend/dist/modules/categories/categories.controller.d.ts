import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service.js';
export declare class CategoriesController {
    private readonly service;
    constructor(service?: CategoriesService);
    getCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCategoryById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const categoriesController: CategoriesController;
