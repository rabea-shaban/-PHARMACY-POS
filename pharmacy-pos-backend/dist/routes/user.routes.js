import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { createUserSchema, updateUserSchema, userQuerySchema, userIdParamSchema, } from '../validators/user.validator.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
export const userRouter = Router();
// All user management routes require staff authentication
userRouter.use(authenticate);
// GET /api/v1/users - List users (Managers only)
userRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateQuery(userQuerySchema), userController.getUsers);
// GET /api/v1/users/:id - Get user profile (Managers only)
userRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(userIdParamSchema), userController.getUserById);
// POST /api/v1/users - Create new staff user (Managers only)
userRouter.post('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateBody(createUserSchema), userController.createUser);
// PATCH /api/v1/users/:id - Update staff user (Managers only)
userRouter.patch('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(userIdParamSchema), validateBody(updateUserSchema), userController.updateUser);
// DELETE /api/v1/users/:id - Soft-deactivate user (Managers only)
userRouter.delete('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER'), validateParams(userIdParamSchema), userController.deleteUser);
// Fallback for missing ID on PATCH and DELETE
userRouter.patch('/', (_req, res) => {
    res.status(400).json({
        success: false,
        message: 'User ID is required in URL path (e.g. PATCH /api/v1/users/<userId>)',
    });
});
userRouter.delete('/', (_req, res) => {
    res.status(400).json({
        success: false,
        message: 'User ID is required in URL path (e.g. DELETE /api/v1/users/<userId>)',
    });
});
//# sourceMappingURL=user.routes.js.map