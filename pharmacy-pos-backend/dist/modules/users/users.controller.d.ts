import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service.js';
export declare class UsersController {
    private readonly service;
    constructor(service?: UsersService);
    getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const usersController: UsersController;
