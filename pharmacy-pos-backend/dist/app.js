import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { healthController } from './modules/health/index.js';
import { apiRouter } from './routes/index.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
export function createApp() {
    const app = express();
    // Hardened security headers
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hidePoweredBy: true,
        xssFilter: true,
        noSniff: true,
        frameguard: { action: 'deny' },
    }));
    // CORS configuration with strict whitelist enforcement
    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests without origin (desktop Electron app, local CLI, server-to-server)
            if (!origin)
                return callback(null, true);
            // Match against configured allowed origins
            const isAllowedConfigured = env.CORS_ORIGIN.some((allowed) => allowed === '*' || allowed === origin);
            // Allow localhost and local dev tools in non-production
            const isLocalDev = env.NODE_ENV !== 'production' &&
                (origin.startsWith('http://localhost:') ||
                    origin.startsWith('http://127.0.0.1:') ||
                    origin.startsWith('app://') ||
                    origin.startsWith('file://'));
            if (isAllowedConfigured || isLocalDev) {
                return callback(null, true);
            }
            return callback(new Error(`Origin '${origin}' not allowed by CORS policy`), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
    }));
    // Cookie parser for HttpOnly authentication cookies
    app.use(cookieParser());
    // Body parser with size limits
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    // Root endpoint
    app.get('/', healthController.getRootStatus);
    // Mount Central API Router
    app.use('/api/v1', apiRouter);
    // 404 Not Found Handler
    app.use(notFoundMiddleware);
    // Centralized Global Error Handler
    app.use(errorMiddleware);
    return app;
}
//# sourceMappingURL=app.js.map