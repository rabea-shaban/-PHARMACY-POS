export declare class AppError extends Error {
    readonly statusCode: number;
    readonly errors?: string[];
    constructor(message: string, statusCode?: number, errors?: string[]);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, errors?: string[]);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, errors?: string[]);
}
