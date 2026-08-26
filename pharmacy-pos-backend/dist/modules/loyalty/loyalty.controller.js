import { loyaltyService } from './loyalty.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class LoyaltyController {
    service;
    constructor(service = loyaltyService) {
        this.service = service;
    }
    getLoyaltySummary = async (req, res, next) => {
        try {
            const customerId = req.params.id;
            const summary = await this.service.getLoyaltySummary(customerId);
            sendSuccess(res, 'Loyalty summary retrieved successfully', summary, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getLoyaltyTransactions = async (req, res, next) => {
        try {
            const customerId = req.params.id;
            const filters = req.query;
            const result = await this.service.getLoyaltyTransactions(customerId, filters);
            sendSuccess(res, 'Loyalty transactions retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    earnPoints = async (req, res, next) => {
        try {
            const customerId = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.earnPoints(customerId, req.body, actorId);
            sendSuccess(res, 'Loyalty points earned successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    redeemPoints = async (req, res, next) => {
        try {
            const customerId = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.redeemPoints(customerId, req.body, actorId);
            sendSuccess(res, 'Loyalty points redeemed successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    adjustPoints = async (req, res, next) => {
        try {
            const customerId = req.params.id;
            const actorId = req.user?.id;
            const actorRole = req.user?.role;
            const result = await this.service.adjustPoints(customerId, req.body, actorId, actorRole);
            sendSuccess(res, 'Loyalty points adjusted successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCustomerTiers = async (_req, res, next) => {
        try {
            const tiers = await this.service.getCustomerTiers();
            sendSuccess(res, 'Customer tiers retrieved successfully', tiers, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const loyaltyController = new LoyaltyController();
//# sourceMappingURL=loyalty.controller.js.map