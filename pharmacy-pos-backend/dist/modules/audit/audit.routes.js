import { Router } from 'express';
import { auditController } from './audit.controller.js';
import { auditQuerySchema, auditSummaryQuerySchema, auditIdParamSchema, } from './audit.validator.js';
import { validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const auditRouter = Router();
// Staff authentication and Manager authorization required for all audit log endpoints
auditRouter.use(authenticate);
auditRouter.use(authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'));
// 1. GET /api/v1/audit-logs/summary - Activity summary & action distribution
auditRouter.get('/summary', validateQuery(auditSummaryQuerySchema), auditController.getActivitySummary);
// 2. GET /api/v1/audit-logs - Query paginated audit logs with filters
auditRouter.get('/', validateQuery(auditQuerySchema), auditController.getAuditLogs);
// 3. GET /api/v1/audit-logs/:id - Get specific audit log entry
auditRouter.get('/:id', validateParams(auditIdParamSchema), auditController.getAuditLogById);
//# sourceMappingURL=audit.routes.js.map