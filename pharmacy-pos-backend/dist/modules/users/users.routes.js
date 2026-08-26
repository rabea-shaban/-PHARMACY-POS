import { Router } from 'express';
import { usersController } from './users.controller.js';
import { createUserSchema, updateUserSchema, userQuerySchema, userIdParamSchema, } from './users.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const usersRouter = Router();
// All user management routes require staff authentication
usersRouter.use(authenticate);
// GET /api/v1/users - List users (Managers only)
usersRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateQuery(userQuerySchema), usersController.getUsers);
// GET /api/v1/users/:id - Get user profile (Managers only)
usersRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(userIdParamSchema), usersController.getUserById);
// POST /api/v1/users - Create new staff user (Managers only)
usersRouter.post('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateBody(createUserSchema), usersController.createUser);
// PATCH /api/v1/users/:id - Update staff user (Managers only)
usersRouter.patch('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(userIdParamSchema), validateBody(updateUserSchema), usersController.updateUser);
// DELETE /api/v1/users/:id - Soft-deactivate user (Managers only)
usersRouter.delete('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(userIdParamSchema), usersController.deleteUser);
// Fallbacks for missing ID on PATCH and DELETE
usersRouter.patch('/', (_req, res) => {
    res.status(400).json({
        success: false,
        message: 'User ID is required in URL path (e.g. PATCH /api/v1/users/<userId>)',
    });
});
usersRouter.delete('/', (_req, res) => {
    res.status(400).json({
        success: false,
        message: 'User ID is required in URL path (e.g. DELETE /api/v1/users/<userId>)',
    });
});
//# sourceMappingURL=users.routes.js.map