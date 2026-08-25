import { Request, Response, NextFunction } from 'express';
import { customersService, CustomersService } from './customers.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { CustomerQueryFilters } from './customers.types.js';

export class CustomersController {
  constructor(private readonly service: CustomersService = customersService) {}

  getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as CustomerQueryFilters;
      const result = await this.service.getCustomers(filters);
      sendSuccess(res, 'Customers retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const customer = await this.service.getCustomerById(id);
      sendSuccess(res, 'Customer profile retrieved successfully', customer, 200);
    } catch (error) {
      next(error);
    }
  };

  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const customer = await this.service.createCustomer(req.body, actorId);
      sendSuccess(res, 'Customer created successfully', customer, 201);
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const customer = await this.service.updateCustomer(id, req.body, actorId);
      sendSuccess(res, 'Customer updated successfully', customer, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const customer = await this.service.deleteCustomer(id, actorId);
      sendSuccess(res, 'Customer deactivated successfully', customer, 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerPurchases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getCustomerPurchases(id, req.query);
      sendSuccess(res, 'Customer purchases retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const customersController = new CustomersController();
