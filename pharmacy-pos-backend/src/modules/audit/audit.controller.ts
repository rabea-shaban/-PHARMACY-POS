import { Request, Response, NextFunction } from 'express';
import { auditService, AuditService } from './audit.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { AuditQueryDTO, AuditSummaryQueryDTO } from './audit.validator.js';

export class AuditController {
  constructor(private readonly service: AuditService = auditService) {}

  getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as AuditQueryDTO;
      const result = await this.service.getAuditLogs(filters);
      sendSuccess(res, 'Audit logs retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getAuditLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getAuditLogById(id);
      sendSuccess(res, 'Audit log details retrieved', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getActivitySummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as AuditSummaryQueryDTO;
      const result = await this.service.getActivitySummary(query.from, query.to);
      sendSuccess(res, 'Audit activity summary retrieved', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const auditController = new AuditController();
