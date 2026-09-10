import { Request, Response, NextFunction } from 'express';
import { transfersService, TransfersService } from './transfers.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { TransferQueryDTO } from './transfers.validator.js';

export class TransfersController {
  constructor(private readonly service: TransfersService = transfersService) {}

  getTransfers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as TransferQueryDTO;
      const result = await this.service.getTransfers(filters);
      sendSuccess(res, 'Transfers retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getTransferById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const transfer = await this.service.getTransferById(id);
      sendSuccess(res, 'Transfer retrieved successfully', transfer, 200);
    } catch (error) {
      next(error);
    }
  };

  createTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const transfer = await this.service.createTransfer(req.body, actorId);
      sendSuccess(res, 'Transfer request created successfully', transfer, 201);
    } catch (error) {
      next(error);
    }
  };

  approveTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const transfer = await this.service.approveTransfer(id, actorId);
      sendSuccess(res, 'Transfer request approved successfully', transfer, 200);
    } catch (error) {
      next(error);
    }
  };

  dispatchTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const transfer = await this.service.dispatchTransfer(id, actorId);
      sendSuccess(res, 'Transfer items dispatched successfully', transfer, 200);
    } catch (error) {
      next(error);
    }
  };

  receiveTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const transfer = await this.service.receiveTransfer(id, actorId);
      sendSuccess(res, 'Transfer items received and stocked successfully', transfer, 200);
    } catch (error) {
      next(error);
    }
  };

  rejectTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const transfer = await this.service.rejectTransfer(id, req.body, actorId);
      sendSuccess(res, 'Transfer request rejected successfully', transfer, 200);
    } catch (error) {
      next(error);
    }
  };

  cancelTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const transfer = await this.service.cancelTransfer(id, actorId);
      sendSuccess(res, 'Transfer request cancelled successfully', transfer, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const transfersController = new TransfersController();
