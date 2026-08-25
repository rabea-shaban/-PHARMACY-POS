import { Request, Response, NextFunction } from 'express';
import { authRepository } from '../modules/auth/auth.repository.js';
import { verifyAccessToken } from '../utils/jwt.util.js';
import { UnauthorizedError } from '../utils/errors.js';
import { AuthenticatedUser } from '../types/auth.types.js';

/**
 * Authentication Middleware:
 * Extracts JWT token from HttpOnly Cookie (accessToken) or Authorization Bearer header,
 * verifies validity, and attaches the active staff user to req.user.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check HttpOnly Cookie
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2. Fallback to Authorization Header: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token is required (via HttpOnly cookie or Bearer header)');
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError('User account not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account has been deactivated');
    }

    req.user = user as AuthenticatedUser;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional Authentication Middleware:
 * Attaches user if a valid token/cookie is present, otherwise passes through silently.
 */
export async function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        const user = await authRepository.findById(payload.userId);
        if (user && user.isActive) {
          req.user = user as AuthenticatedUser;
        }
      } catch {
        // Continue unauthenticated if token is invalid
      }
    }
    next();
  } catch {
    next();
  }
}
