import { auditService } from './audit.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class AuditController {
    service;
    constructor(service = auditService) {
        this.service = service;
    }
    getAuditLogs = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getAuditLogs(filters);
            sendSuccess(res, 'Audit logs retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getAuditLogById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await this.service.getAuditLogById(id);
            sendSuccess(res, 'Audit log details retrieved', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getActivitySummary = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.service.getActivitySummary(query.from, query.to);
            sendSuccess(res, 'Audit activity summary retrieved', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const auditController = new AuditController();
//# sourceMappingURL=audit.controller.js.map