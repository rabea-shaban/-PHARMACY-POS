import { saleReturnsService } from './sale-returns.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class SaleReturnsController {
    service;
    constructor(service = saleReturnsService) {
        this.service = service;
    }
    getSaleReturns = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getSaleReturns(filters);
            sendSuccess(res, 'Sale returns retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSaleReturnById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await this.service.getSaleReturnById(id);
            sendSuccess(res, 'Sale return retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getReturnsBySaleId = async (req, res, next) => {
        try {
            const saleId = req.params.saleId;
            const result = await this.service.getReturnsBySaleId(saleId);
            sendSuccess(res, 'Returns for sale retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createSaleReturn = async (req, res, next) => {
        try {
            const processedById = req.user?.id;
            const result = await this.service.createSaleReturn(req.body, processedById);
            sendSuccess(res, 'Sale return processed successfully', result, 201);
        }
        catch (error) {
            next(error);
        }
    };
}
export const saleReturnsController = new SaleReturnsController();
//# sourceMappingURL=sale-returns.controller.js.map