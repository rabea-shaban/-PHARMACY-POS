import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
export const loginRateLimiter = rateLimit({
    windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS,
    max: env.LOGIN_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes',
    },
});
//# sourceMappingURL=rate-limit.middleware.js.map