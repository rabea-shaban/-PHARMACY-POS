import { Request, Response, NextFunction } from 'express';
import { branchesService, BranchesService } from './branches.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { BranchQueryDTO } from './branches.validator.js';

export class BranchesController {
  constructor(private readonly service: BranchesService = branchesService) {}

  getBranches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as BranchQueryDTO;
      const result = await this.service.getBranches(filters);
      sendSuccess(res, 'Branches retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getBranchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const branch = await this.service.getBranchById(id);
      sendSuccess(res, 'Branch retrieved successfully', branch, 200);
    } catch (error) {
      next(error);
    }
  };

  createBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const branch = await this.service.createBranch(req.body, actorId);
      sendSuccess(res, 'Branch created successfully', branch, 201);
    } catch (error) {
      next(error);
    }
  };

  updateBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const branch = await this.service.updateBranch(id, req.body, actorId);
      sendSuccess(res, 'Branch updated successfully', branch, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const branch = await this.service.deleteBranch(id, actorId);
      sendSuccess(res, 'Branch deactivated successfully', branch, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const branchesController = new BranchesController();
