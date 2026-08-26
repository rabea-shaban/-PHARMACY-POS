import { discountsService } from './discounts.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class DiscountsController {
    service;
    constructor(service = discountsService) {
        this.service = service;
    }
    getDiscounts = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getDiscounts(filters);
            sendSuccess(res, 'Discounts retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getDiscountById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const discount = await this.service.getDiscountById(id);
            sendSuccess(res, 'Discount retrieved successfully', discount, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createDiscount = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const discount = await this.service.createDiscount(req.body, actorId);
            sendSuccess(res, 'Discount created successfully', discount, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateDiscount = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const discount = await this.service.updateDiscount(id, req.body, actorId);
            sendSuccess(res, 'Discount updated successfully', discount, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteDiscount = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const discount = await this.service.deleteDiscount(id, actorId);
            sendSuccess(res, 'Discount deactivated successfully', discount, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const discountsController = new DiscountsController();
//# sourceMappingURL=discounts.controller.js.map