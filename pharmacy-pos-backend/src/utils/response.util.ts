import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  errors?: Array<{ field?: string; message: string }> | string[],
  statusCode = 400
): void {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  res.status(statusCode).json(response);
}
