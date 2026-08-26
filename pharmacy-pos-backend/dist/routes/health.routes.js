import { Router } from 'express';
import { getHealthStatus, testDatabaseOperations } from '../controllers/health.controller.js';
const router = Router();
// GET /api/v1/health
router.get('/', getHealthStatus);
// GET /api/v1/health/test-db
router.get('/test-db', testDatabaseOperations);
export const healthRoutes = router;
export const healthRouter = router;
//# sourceMappingURL=health.routes.js.map