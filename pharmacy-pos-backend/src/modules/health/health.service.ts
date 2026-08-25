import { checkDatabaseConnection, verifyDatabaseOperations } from '../../lib/prisma.js';

export class HealthService {
  async getDatabaseStatus(): Promise<boolean> {
    return checkDatabaseConnection();
  }

  async runDatabaseTest() {
    return verifyDatabaseOperations();
  }
}

export const healthService = new HealthService();
