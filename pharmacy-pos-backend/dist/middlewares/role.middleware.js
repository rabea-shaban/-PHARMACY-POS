import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
/**
 * Role-Based Access Control (RBAC) Middleware.
 * Ensures the authenticated user has one of the allowed roles.
 */
export function authorize(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
}
// Named alias
export const roleMiddleware = authorize;
//# sourceMappingURL=role.middleware.js.map