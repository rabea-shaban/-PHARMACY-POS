import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { healthController } from './modules/health/index.js';
import { apiRouter } from './routes/index.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration (supports credentials / cookies)
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        if (env.NODE_ENV === 'development') {
          return callback(null, true);
        }

        if (env.CORS_ORIGIN.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Blocked by CORS policy'));
      },
      credentials: true,
    })
  );

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
