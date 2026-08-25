import { Request, Response, NextFunction } from 'express';
import { categoriesService, CategoriesService } from './categories.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { CategoryQueryFilters } from './categories.types.js';

export class CategoriesController {
  constructor(private readonly service: CategoriesService = categoriesService) {}

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as CategoryQueryFilters;
      const result = await this.service.getCategories(filters);
      sendSuccess(res, 'Categories retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const category = await this.service.getCategoryById(id);
      sendSuccess(res, 'Category retrieved successfully', category, 200);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const category = await this.service.createCategory(req.body, actorId);
      sendSuccess(res, 'Category created successfully', category, 201);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const category = await this.service.updateCategory(id, req.body, actorId);
      sendSuccess(res, 'Category updated successfully', category, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const category = await this.service.deleteCategory(id, actorId);
      sendSuccess(res, 'Category deactivated successfully', category, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const categoriesController = new CategoriesController();
