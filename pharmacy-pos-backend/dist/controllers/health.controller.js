import { checkDatabaseConnection, verifyDatabaseOperations } from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
/**
 * Root endpoint handler
 * GET /
 */
export function getRootStatus(_req, res) {
    sendSuccess(res, 'Pharmacy POS API is running', {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    });
}
/**
 * Health check endpoint verifying database connectivity
 * GET /api/v1/health
 */
export async function getHealthStatus(_req, res) {
    const isDbConnected = await checkDatabaseConnection();
    if (isDbConnected) {
        sendSuccess(res, 'Pharmacy POS API is healthy', {
            application: 'healthy',
            database: 'connected',
        });
    }
    else {
        sendError(res, 'Database connection failed', ['Unable to reach local MySQL database'], 503);
    }
}
/**
 * Database operation test endpoint (INSERT + SELECT verification)
 * GET /api/v1/health/test-db
 */
export async function testDatabaseOperations(_req, res) {
    try {
        const result = await verifyDatabaseOperations();
        sendSuccess(res, 'Database INSERT and SELECT operations verified successfully', {
            lastInsertedRecord: result.inserted,
            totalRecords: result.totalCount,
        });
    }
    catch (error) {
        const errMessage = error instanceof Error ? error.message : 'Database operation failed';
        sendError(res, 'Database operation test failed', [errMessage], 500);
    }
}
//# sourceMappingURL=health.controller.js.map