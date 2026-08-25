import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

function sanitizeErrorMessage(msg: string): string {
  return msg.replace(/(mysql|mariadb|postgres|postgresql):\/\/([^:]+):([^@]+)@/gi, '$1://$2:***@');
}

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const errorDetails = err.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'body';
      return `${path}: ${issue.message}`;
    });

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails,
    });
    return;
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: sanitizeErrorMessage(err.message),
      ...(err.errors && { errors: err.errors.map(sanitizeErrorMessage) }),
    });
    return;
  }

  // 3. Unexpected Server Errors
  const statusCode = err.status || err.statusCode || 500;
  const rawMessage = err.message || 'Internal server error';
  const sanitizedMessage = sanitizeErrorMessage(rawMessage);

  console.error(`[Error] ${statusCode} - ${sanitizedMessage}`);
  if (env.NODE_ENV === 'development' && err.stack) {
    console.error(sanitizeErrorMessage(err.stack));
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && env.NODE_ENV === 'production' ? 'Internal server error' : sanitizedMessage,
    ...(env.NODE_ENV === 'development' && err.stack ? { stack: sanitizeErrorMessage(err.stack) } : {}),
  });
};
