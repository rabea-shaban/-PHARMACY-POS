import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
function validateAndLoadEnv() {
    const errors = [];
    const portRaw = process.env.PORT || '5000';
    const port = parseInt(portRaw, 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
        errors.push('PORT must be a valid port number (1-65535)');
    }
    const nodeEnv = (process.env.NODE_ENV || 'development');
    if (!['development', 'production', 'test'].includes(nodeEnv)) {
        errors.push('NODE_ENV must be one of: development, production, test');
    }
    const corsOriginRaw = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173';
    const corsOrigins = corsOriginRaw
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) {
        errors.push('Missing MySQL configuration: DATABASE_URL must be defined in .env');
    }
    const jwtSecret = process.env.JWT_SECRET?.trim() || 'default-fallback-dev-jwt-secret-key-32chars!';
    if (jwtSecret.length < 16) {
        errors.push('JWT_SECRET must be at least 16 characters long for security');
    }
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || '1d';
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const rateLimitWindow = parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10);
    const rateLimitMax = parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10);
    if (errors.length > 0) {
        console.error('❌ Environment configuration validation failed:');
        for (const err of errors) {
            console.error(`  - ${err}`);
        }
        throw new Error(`Environment validation failed with ${errors.length} error(s). Please check your .env configuration.`);
    }
    return {
        PORT: port,
        NODE_ENV: nodeEnv,
        CORS_ORIGIN: corsOrigins,
        DATABASE_URL: databaseUrl,
        JWT_SECRET: jwtSecret,
        JWT_EXPIRES_IN: jwtExpiresIn,
        BCRYPT_SALT_ROUNDS: isNaN(saltRounds) ? 10 : saltRounds,
        LOGIN_RATE_LIMIT_WINDOW_MS: isNaN(rateLimitWindow) ? 900000 : rateLimitWindow,
        LOGIN_RATE_LIMIT_MAX: isNaN(rateLimitMax) ? 10 : rateLimitMax,
    };
}
export const env = validateAndLoadEnv();
//# sourceMappingURL=env.js.map