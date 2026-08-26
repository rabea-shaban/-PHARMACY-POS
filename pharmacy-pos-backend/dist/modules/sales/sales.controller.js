import { salesService } from './sales.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class SalesController {
    service;
    constructor(service = salesService) {
        this.service = service;
    }
    getSales = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getSales(filters);
            sendSuccess(res, 'Sales retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSaleById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const sale = await this.service.getSaleById(id);
            sendSuccess(res, 'Sale retrieved successfully', sale, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSaleByInvoice = async (req, res, next) => {
        try {
            const invoiceNumber = req.params.invoiceNumber;
            const sale = await this.service.getSaleByInvoiceNumber(invoiceNumber);
            sendSuccess(res, 'Sale retrieved by invoice number successfully', sale, 200);
        }
        catch (error) {
            next(error);
        }
    };
    checkout = async (req, res, next) => {
        try {
            const cashierId = req.user?.id;
            const sale = await this.service.checkout(req.body, cashierId);
            sendSuccess(res, 'Sale completed successfully', sale, 201);
        }
        catch (error) {
            next(error);
        }
    };
    cancelSale = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const sale = await this.service.cancelSale(id, actorId, req.body);
            sendSuccess(res, 'Sale cancelled successfully', sale, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const salesController = new SalesController();
//# sourceMappingURL=sales.controller.js.map