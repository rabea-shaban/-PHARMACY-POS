import { reportsService } from './reports.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class ReportsController {
    service;
    constructor(service = reportsService) {
        this.service = service;
    }
    getSalesReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getSalesReport(filters);
            sendSuccess(res, 'Sales report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getProductReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getProductPerformanceReport(filters);
            sendSuccess(res, 'Product performance report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getInventoryReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getInventoryReport(filters);
            sendSuccess(res, 'Inventory report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getPurchaseReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getPurchaseReport(filters);
            sendSuccess(res, 'Purchases and suppliers report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getExpenseReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getExpenseReport(filters);
            sendSuccess(res, 'Expenses report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCustomerReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getCustomerReport(filters);
            sendSuccess(res, 'Customers and loyalty report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getStaffReport = async (req, res, next) => {
        try {
            const filters = req.query;
            const report = await this.service.getStaffReport(filters);
            sendSuccess(res, 'Staff performance and commissions report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getFinancialSummary = async (req, res, next) => {
        try {
            const from = req.query.from;
            const to = req.query.to;
            const report = await this.service.getFinancialSummary(from, to);
            sendSuccess(res, 'Financial summary report generated successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const reportsController = new ReportsController();
//# sourceMappingURL=reports.controller.js.map