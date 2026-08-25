import { Request, Response, NextFunction } from 'express';
import { dashboardService, DashboardService } from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.util.js';

export class DashboardController {
  constructor(private readonly service: DashboardService = dashboardService) {}

  getOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      const overview = await this.service.getOverview(from, to);
      sendSuccess(res, 'Dashboard overview retrieved successfully', overview, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();
