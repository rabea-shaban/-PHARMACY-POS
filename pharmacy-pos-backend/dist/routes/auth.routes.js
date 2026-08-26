import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { loginSchema } from '../validators/auth.validator.js';
import { createUserSchema } from '../validators/user.validator.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { loginRateLimiter } from '../middleware/rate-limit.middleware.js';
export const authRouter = Router();
// POST /api/v1/auth/login (Rate limited & validated)
authRouter.post('/login', loginRateLimiter, validateBody(loginSchema), authController.login);
// POST /api/v1/auth/register (Register Staff - Super Admin & Admin only, or initial bootstrap)
authRouter.post('/register', optionalAuthenticate, validateBody(createUserSchema), authController.register);
// POST /api/v1/auth/logout (Clears HttpOnly cookie)
authRouter.post('/logout', authenticate, authController.logout);
// GET /api/v1/auth/me (Protected by authenticate middleware)
authRouter.get('/me', authenticate, authController.getMe);
//# sourceMappingURL=auth.routes.js.map