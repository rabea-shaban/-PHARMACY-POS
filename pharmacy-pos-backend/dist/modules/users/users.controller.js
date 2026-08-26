import { usersService } from './users.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { UnauthorizedError } from '../../utils/errors.js';
export class UsersController {
    service;
    constructor(service = usersService) {
        this.service = service;
    }
    getUsers = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.service.getUsers(query);
            sendSuccess(res, 'Users retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getUserById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await this.service.getUserById(id);
            sendSuccess(res, 'User retrieved successfully', user, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createUser = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }
            const user = await this.service.createUser(req.body, req.user.id, req.user.role);
            sendSuccess(res, 'User created successfully', user, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateUser = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }
            const id = req.params.id;
            const user = await this.service.updateUser(id, req.body, req.user.id, req.user.role);
            sendSuccess(res, 'User updated successfully', user, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }
            const id = req.params.id;
            const user = await this.service.deleteUser(id, req.user.id);
            sendSuccess(res, 'User deactivated successfully', user, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const usersController = new UsersController();
//# sourceMappingURL=users.controller.js.map