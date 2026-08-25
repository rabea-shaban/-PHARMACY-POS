import { Request, Response, NextFunction } from 'express';
import { insuranceService, InsuranceService } from './insurance.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { InsuranceQueryFilters } from './insurance.types.js';

export class InsuranceController {
  constructor(private readonly service: InsuranceService = insuranceService) {}

  getProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as InsuranceQueryFilters;
      const result = await this.service.getProviders(filters);
      sendSuccess(res, 'Insurance providers retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const provider = await this.service.getProviderById(id);
      sendSuccess(res, 'Insurance provider retrieved successfully', provider, 200);
    } catch (error) {
      next(error);
    }
  };

  createProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const provider = await this.service.createProvider(req.body, actorId);
      sendSuccess(res, 'Insurance provider created successfully', provider, 201);
    } catch (error) {
      next(error);
    }
  };

  updateProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const provider = await this.service.updateProvider(id, req.body, actorId);
      sendSuccess(res, 'Insurance provider updated successfully', provider, 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerInsurances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.customerId as string;
      const result = await this.service.getCustomerInsurances(customerId);
      sendSuccess(res, 'Customer insurances retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  createCustomerInsurance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const insurance = await this.service.createCustomerInsurance(req.body, actorId);
      sendSuccess(res, 'Customer insurance policy registered successfully', insurance, 201);
    } catch (error) {
      next(error);
    }
  };
}

export const insuranceController = new InsuranceController();
