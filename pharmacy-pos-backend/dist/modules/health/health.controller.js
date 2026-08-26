import { healthService } from './health.service.js';
import { sendSuccess, sendError } from '../../utils/response.util.js';
import { env } from '../../config/env.js';
export class HealthController {
    service;
    constructor(service = healthService) {
        this.service = service;
    }
    getRootStatus = (_req, res) => {
        sendSuccess(res, 'Pharmacy POS API is running', {
            version: '1.0.0',
            environment: env.NODE_ENV,
        });
    };
    getHealthStatus = async (_req, res) => {
        const isDbConnected = await this.service.getDatabaseStatus();
        if (isDbConnected) {
            sendSuccess(res, 'Pharmacy POS API is healthy', {
                application: 'healthy',
                database: 'connected',
            });
        }
        else {
            sendError(res, 'Database connection failed', ['Unable to reach local MySQL database'], 503);
        }
    };
    testDatabaseOperations = async (_req, res) => {
        try {
            const result = await this.service.runDatabaseTest();
            sendSuccess(res, 'Database INSERT and SELECT operations verified successfully', {
                lastInsertedRecord: result.inserted,
                totalRecords: result.totalCount,
            });
        }
        catch (error) {
            const errMessage = error instanceof Error ? error.message : 'Database operation failed';
            sendError(res, 'Database operation test failed', [errMessage], 500);
        }
    };
}
export const healthController = new HealthController();
//# sourceMappingURL=health.controller.js.map