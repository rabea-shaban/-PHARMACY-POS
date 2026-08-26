import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
/**
 * Role-Based Access Control (RBAC) Authorization Middleware.
 */
export declare function authorize(...allowedRoles: Role[]): (req: Request, _res: Response, next: NextFunction) => void;
