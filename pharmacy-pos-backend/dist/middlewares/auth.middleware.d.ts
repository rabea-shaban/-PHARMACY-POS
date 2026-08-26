import { Request, Response, NextFunction } from 'express';
/**
 * Authentication Middleware:
 * Extracts JWT token from HttpOnly Cookie (accessToken) or Authorization Bearer header,
 * verifies validity, and attaches the active staff user to req.user.
 */
export declare function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
/**
 * Optional Authentication Middleware:
 * Attaches user if a valid token/cookie is present, otherwise passes through silently.
 */
export declare function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
