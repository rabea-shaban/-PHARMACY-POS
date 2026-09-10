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
    // CORS configuration
    app.use(cors({
        origin: (origin, callback) => {
            // 1. Allow requests with no origin (Electron, Curl, Mobile apps, Postman)
            if (!origin)
                return callback(null, true);
            // 2. Allow all Vercel domains (*.vercel.app) and Hostinger domains
            if (origin.endsWith('.vercel.app') ||
                origin.includes('vercel.app') ||
                origin.includes('hostingersite.com')) {
                return callback(null, true);
            }
            // 3. Allow localhost / 127.0.0.1 on any port
            if (origin.startsWith('http://localhost') ||
                origin.startsWith('https://localhost') ||
                origin.startsWith('http://127.0.0.1') ||
                origin.startsWith('https://127.0.0.1')) {
                return callback(null, true);
            }
            // 4. Allow Chrome / Firefox extensions, Electron apps, Capacitor, Ionic, local file
            if (origin.startsWith('chrome-extension://') ||
                origin.startsWith('moz-extension://') ||
                origin.startsWith('app://') ||
                origin.startsWith('file://') ||
                origin.startsWith('capacitor://') ||
                origin.startsWith('ionic://')) {
                return callback(null, true);
            }
            // 5. Match against explicitly configured allowed origins
            if (env.CORS_ORIGIN.some((allowed) => allowed === '*' || allowed === origin || origin.includes(allowed))) {
                return callback(null, true);
            }
            // 6. In non-production, allow all origins
            if (env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cookie', 'DNT', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'],
        exposedHeaders: ['Set-Cookie'],
        maxAge: 86400,
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