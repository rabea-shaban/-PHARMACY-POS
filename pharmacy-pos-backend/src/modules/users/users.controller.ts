import { Request, Response, NextFunction } from 'express';
import { usersService, UsersService } from './users.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { UserQueryParams } from './users.types.js';

export class UsersController {
  constructor(private readonly service: UsersService = usersService) {}

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as UserQueryParams;
      const result = await this.service.getUsers(query);
      sendSuccess(res, 'Users retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = await this.service.getUserById(id);
      sendSuccess(res, 'User retrieved successfully', user, 200);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const user = await this.service.createUser(req.body, req.user.id, req.user.role);
      sendSuccess(res, 'User created successfully', user, 201);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const id = req.params.id as string;
      const user = await this.service.updateUser(id, req.body, req.user.id, req.user.role);
      sendSuccess(res, 'User updated successfully', user, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const id = req.params.id as string;
      const user = await this.service.deleteUser(id, req.user.id);
      sendSuccess(res, 'User deactivated successfully', user, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController();
