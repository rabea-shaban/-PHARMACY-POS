import { paymentsService } from './payments.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class PaymentsController {
    service;
    constructor(service = paymentsService) {
        this.service = service;
    }
    getPayments = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getPayments(filters);
            sendSuccess(res, 'Payments retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getPaymentById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const payment = await this.service.getPaymentById(id);
            sendSuccess(res, 'Payment retrieved successfully', payment, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getPaymentsBySaleId = async (req, res, next) => {
        try {
            const saleId = req.params.saleId;
            const result = await this.service.getPaymentsBySaleId(saleId);
            sendSuccess(res, 'Sale payments retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const paymentsController = new PaymentsController();
//# sourceMappingURL=payments.controller.js.map