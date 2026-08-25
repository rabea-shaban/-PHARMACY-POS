import { Request, Response, NextFunction } from 'express';
import { securityService, SecurityService } from './security.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { SecurityQueryDTO, SecurityStatsQueryDTO } from './security.validator.js';

export class SecurityController {
  constructor(private readonly service: SecurityService = securityService) {}

  getLoginLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as SecurityQueryDTO;
      const result = await this.service.getLoginLogs(filters);
      sendSuccess(res, 'Security login logs retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as SecurityStatsQueryDTO;
      const result = await this.service.getStats(query.from, query.to);
      sendSuccess(res, 'Security login statistics retrieved', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const securityController = new SecurityController();
