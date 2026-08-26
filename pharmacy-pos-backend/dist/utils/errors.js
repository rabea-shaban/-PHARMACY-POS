export class AppError extends Error {
    statusCode;
    errors;
    constructor(message, statusCode = 500, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends AppError {
    constructor(message = 'Bad request', errors) {
        super(message, 400, errors);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Invalid credentials') {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden: insufficient permissions') {
        super(message, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
export class ConflictError extends AppError {
    constructor(message = 'Resource conflict: unique constraint violated') {
        super(message, 409);
    }
}
export class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors) {
        super(message, 400, errors);
    }
}
//# sourceMappingURL=errors.js.map