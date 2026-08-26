import { categoriesService } from './categories.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class CategoriesController {
    service;
    constructor(service = categoriesService) {
        this.service = service;
    }
    getCategories = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getCategories(filters);
            sendSuccess(res, 'Categories retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCategoryById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const category = await this.service.getCategoryById(id);
            sendSuccess(res, 'Category retrieved successfully', category, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createCategory = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const category = await this.service.createCategory(req.body, actorId);
            sendSuccess(res, 'Category created successfully', category, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateCategory = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const category = await this.service.updateCategory(id, req.body, actorId);
            sendSuccess(res, 'Category updated successfully', category, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteCategory = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const category = await this.service.deleteCategory(id, actorId);
            sendSuccess(res, 'Category deactivated successfully', category, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const categoriesController = new CategoriesController();
//# sourceMappingURL=categories.controller.js.map