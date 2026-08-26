import { payrollService } from './payroll.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class PayrollController {
    service;
    constructor(service = payrollService) {
        this.service = service;
    }
    generatePayroll = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const result = await this.service.generatePayroll(req.body, actorId);
            sendSuccess(res, 'Payroll calculated and generated successfully', result, 201);
        }
        catch (error) {
            next(error);
        }
    };
    generatePeriodPayroll = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const result = await this.service.generatePeriodPayroll(req.body, actorId);
            sendSuccess(res, `Generated ${result.length} payroll records for the period`, result, 201);
        }
        catch (error) {
            next(error);
        }
    };
    getPayrolls = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getPayrolls(filters);
            sendSuccess(res, 'Payrolls retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getPayrollById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await this.service.getPayrollById(id);
            sendSuccess(res, 'Payroll details retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getEmployeePayrolls = async (req, res, next) => {
        try {
            const employeeId = req.params.employeeId;
            const result = await this.service.getEmployeePayrolls(employeeId);
            sendSuccess(res, 'Employee payroll history retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    updatePayroll = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.updatePayroll(id, req.body, actorId);
            sendSuccess(res, 'Payroll record updated successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    approvePayroll = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.approvePayroll(id, actorId);
            sendSuccess(res, 'Payroll approved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    payPayroll = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.payPayroll(id, req.body, actorId);
            sendSuccess(res, 'Payroll settlement completed successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    cancelPayroll = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.cancelPayroll(id, actorId);
            sendSuccess(res, 'Payroll record cancelled successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSummary = async (req, res, next) => {
        try {
            const from = req.query.from;
            const to = req.query.to;
            const result = await this.service.getSummary(from, to);
            sendSuccess(res, 'Payroll summary retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const payrollController = new PayrollController();
//# sourceMappingURL=payroll.controller.js.map