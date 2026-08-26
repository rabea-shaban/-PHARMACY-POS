import { customersService } from './customers.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class CustomersController {
    service;
    constructor(service = customersService) {
        this.service = service;
    }
    getCustomers = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getCustomers(filters);
            sendSuccess(res, 'Customers retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCustomerById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const customer = await this.service.getCustomerById(id);
            sendSuccess(res, 'Customer profile retrieved successfully', customer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createCustomer = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const customer = await this.service.createCustomer(req.body, actorId);
            sendSuccess(res, 'Customer created successfully', customer, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateCustomer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const customer = await this.service.updateCustomer(id, req.body, actorId);
            sendSuccess(res, 'Customer updated successfully', customer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteCustomer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const customer = await this.service.deleteCustomer(id, actorId);
            sendSuccess(res, 'Customer deactivated successfully', customer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCustomerPurchases = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await this.service.getCustomerPurchases(id, req.query);
            sendSuccess(res, 'Customer purchases retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const customersController = new CustomersController();
//# sourceMappingURL=customers.controller.js.map