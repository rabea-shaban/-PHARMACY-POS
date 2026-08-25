import { Router } from 'express';
import { healthController } from './health.controller.js';

export const healthRoutes = Router();

// GET /api/v1/health
healthRoutes.get('/', healthController.getHealthStatus);

// GET /api/v1/health/test-db
healthRoutes.get('/test-db', healthController.testDatabaseOperations);

// Alias
export const healthRouter = healthRoutes;
