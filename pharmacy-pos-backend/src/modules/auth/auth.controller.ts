import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { env } from '../../config/env.js';

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(req.body);

      const isProduction = env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

      // Set secure HttpOnly Cookie (accessible only by server, prevents XSS token theft)
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
      });

      sendSuccess(res, 'Login successful', result, 200);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const actorRole = req.user?.role;
      const user = await this.service.register(req.body, actorId, actorRole);
      sendSuccess(res, 'Staff member registered successfully', user, 201);
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

      // Clear HttpOnly authentication cookie
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      });

      sendSuccess(res, 'Logout successful', null, 200);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const user = await this.service.getMe(req.user.id);
      sendSuccess(res, 'User profile retrieved successfully', user, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
