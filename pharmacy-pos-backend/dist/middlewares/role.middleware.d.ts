import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
/**
 * Role-Based Access Control (RBAC) Middleware.
 * Ensures the authenticated user has one of the allowed roles.
 */
export declare function authorize(...allowedRoles: Role[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare const roleMiddleware: typeof authorize;
