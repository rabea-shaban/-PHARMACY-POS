import { checkDatabaseConnection, verifyDatabaseOperations } from '../../lib/prisma.js';
export class HealthService {
    async getDatabaseStatus() {
        return checkDatabaseConnection();
    }
    async runDatabaseTest() {
        return verifyDatabaseOperations();
    }
}
export const healthService = new HealthService();
//# sourceMappingURL=health.service.js.map