import { insuranceService } from './insurance.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class InsuranceController {
    service;
    constructor(service = insuranceService) {
        this.service = service;
    }
    getProviders = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getProviders(filters);
            sendSuccess(res, 'Insurance providers retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getProviderById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const provider = await this.service.getProviderById(id);
            sendSuccess(res, 'Insurance provider retrieved successfully', provider, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createProvider = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const provider = await this.service.createProvider(req.body, actorId);
            sendSuccess(res, 'Insurance provider created successfully', provider, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateProvider = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const provider = await this.service.updateProvider(id, req.body, actorId);
            sendSuccess(res, 'Insurance provider updated successfully', provider, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCustomerInsurances = async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await this.service.getCustomerInsurances(customerId);
            sendSuccess(res, 'Customer insurances retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createCustomerInsurance = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const insurance = await this.service.createCustomerInsurance(req.body, actorId);
            sendSuccess(res, 'Customer insurance policy registered successfully', insurance, 201);
        }
        catch (error) {
            next(error);
        }
    };
}
export const insuranceController = new InsuranceController();
//# sourceMappingURL=insurance.controller.js.map