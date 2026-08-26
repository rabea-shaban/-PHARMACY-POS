import { Request, Response } from 'express';
/**
 * Root endpoint handler
 * GET /
 */
export declare function getRootStatus(_req: Request, res: Response): void;
/**
 * Health check endpoint verifying database connectivity
 * GET /api/v1/health
 */
export declare function getHealthStatus(_req: Request, res: Response): Promise<void>;
/**
 * Database operation test endpoint (INSERT + SELECT verification)
 * GET /api/v1/health/test-db
 */
export declare function testDatabaseOperations(_req: Request, res: Response): Promise<void>;
