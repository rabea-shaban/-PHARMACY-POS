import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly service;
    constructor(service?: DashboardService);
    getOverview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const dashboardController: DashboardController;
