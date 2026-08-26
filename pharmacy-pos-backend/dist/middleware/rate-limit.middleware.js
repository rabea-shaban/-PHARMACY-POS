import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
export const loginRateLimiter = rateLimit({
    windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS, // default 15 minutes
    max: env.LOGIN_RATE_LIMIT_MAX, // default 10 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes',
    },
});
//# sourceMappingURL=rate-limit.middleware.js.map