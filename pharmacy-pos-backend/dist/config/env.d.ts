export interface EnvironmentConfig {
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    CORS_ORIGIN: string[];
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    BCRYPT_SALT_ROUNDS: number;
    LOGIN_RATE_LIMIT_WINDOW_MS: number;
    LOGIN_RATE_LIMIT_MAX: number;
}
export declare const env: EnvironmentConfig;
