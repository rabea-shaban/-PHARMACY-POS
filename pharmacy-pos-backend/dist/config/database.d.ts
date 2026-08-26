export interface DatabaseConfig {
    url: string;
    host: string;
    port: number;
    user: string;
    database: string;
    connectionLimit: number;
}
export declare const databaseConfig: DatabaseConfig;
