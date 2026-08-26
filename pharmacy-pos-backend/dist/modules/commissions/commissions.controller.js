import { commissionsService } from './commissions.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class CommissionsController {
    service;
    constructor(service = commissionsService) {
        this.service = service;
    }
    getRules = async (_req, res, next) => {
        try {
            const rules = await this.service.getRules();
            sendSuccess(res, 'Commission rules retrieved successfully', rules, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createRule = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const rule = await this.service.createRule(req.body, actorId);
            sendSuccess(res, 'Commission rule created successfully', rule, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateRule = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const rule = await this.service.updateRule(id, req.body, actorId);
            sendSuccess(res, 'Commission rule updated successfully', rule, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getTransactions = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getTransactions(filters);
            sendSuccess(res, 'Commission transactions retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getStaffTransactions = async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const filters = req.query;
            const result = await this.service.getStaffTransactions(userId, filters);
            sendSuccess(res, 'Staff commission transactions retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSummary = async (req, res, next) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const summary = await this.service.getSummary(startDate, endDate);
            sendSuccess(res, 'Commission summary retrieved successfully', summary, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const commissionsController = new CommissionsController();
//# sourceMappingURL=commissions.controller.js.map