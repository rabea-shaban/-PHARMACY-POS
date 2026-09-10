import { Request, Response, NextFunction } from 'express';
import { BranchesService } from './branches.service.js';
export declare class BranchesController {
    private readonly service;
    constructor(service?: BranchesService);
    getBranches: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBranchById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createBranch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBranch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteBranch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const branchesController: BranchesController;
