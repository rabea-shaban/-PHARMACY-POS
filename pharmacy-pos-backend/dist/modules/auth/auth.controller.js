import { authService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { env } from '../../config/env.js';
export class AuthController {
    service;
    constructor(service = authService) {
        this.service = service;
    }
    login = async (req, res, next) => {
        try {
            const result = await this.service.login(req.body);
            // Set secure HttpOnly Cookie (accessible only by server, prevents XSS token theft)
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/',
            });
            sendSuccess(res, 'Login successful', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    register = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const actorRole = req.user?.role;
            const user = await this.service.register(req.body, actorId, actorRole);
            sendSuccess(res, 'Staff member registered successfully', user, 201);
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (_req, res, next) => {
        try {
            // Clear HttpOnly authentication cookie
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            sendSuccess(res, 'Logout successful', null, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getMe = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }
            const user = await this.service.getMe(req.user.id);
            sendSuccess(res, 'User profile retrieved successfully', user, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map