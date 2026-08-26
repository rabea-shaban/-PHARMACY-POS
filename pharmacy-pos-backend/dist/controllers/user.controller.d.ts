import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
export declare class UserController {
    private readonly service;
    constructor(service?: UserService);
    getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const userController: UserController;
