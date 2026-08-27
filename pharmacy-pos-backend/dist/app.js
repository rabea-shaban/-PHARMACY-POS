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
    // Security headers
    app.use(helmet({ crossOriginResourcePolicy: false }));
    // CORS configuration (supports credentials / cookies across Vercel and local origins)
    app.use(cors({
        origin: (origin, callback) => {
            // Always allow server-to-server, curl, mobile, or requests without Origin header
            if (!origin)
                return callback(null, true);
            // Allow localhost, vercel domains, hostinger, or any configured CORS_ORIGIN
            if (origin.includes('localhost') ||
                origin.includes('vercel.app') ||
                origin.includes('hostingersite.com') ||
                env.CORS_ORIGIN.some((allowed) => allowed === '*' || origin === allowed) ||
                env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
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