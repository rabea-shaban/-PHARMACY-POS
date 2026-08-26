export declare class HealthService {
    getDatabaseStatus(): Promise<boolean>;
    runDatabaseTest(): Promise<{
        inserted: {
            id: number;
            message: string;
            createdAt: Date;
        };
        totalCount: number;
    }>;
}
export declare const healthService: HealthService;
