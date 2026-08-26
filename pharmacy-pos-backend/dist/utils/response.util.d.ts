import { Response } from 'express';
export declare function sendSuccess<T>(res: Response, message: string, data?: T, statusCode?: number): void;
export declare function sendError(res: Response, message: string, errors?: Array<{
    field?: string;
    message: string;
}> | string[], statusCode?: number): void;
