import { Request, Response, NextFunction } from 'express';
import { TransfersService } from './transfers.service.js';
export declare class TransfersController {
    private readonly service;
    constructor(service?: TransfersService);
    getTransfers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransferById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createTransfer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveTransfer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    dispatchTransfer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    receiveTransfer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectTransfer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelTransfer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const transfersController: TransfersController;
