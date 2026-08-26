import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly service;
    constructor(service?: AuthService);
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const authController: AuthController;
