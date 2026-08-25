import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((issue) => {
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
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = (await schema.parseAsync(req.query)) as Record<string, unknown>;
      for (const [key, value] of Object.entries(validated)) {
        (req.query as Record<string, unknown>)[key] = value;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'query';
          return `${path}: ${issue.message}`;
        });
        res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: errorDetails,
        });
        return;
      }
      next(error);
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = (await schema.parseAsync(req.params)) as Record<string, unknown>;
      for (const [key, value] of Object.entries(validated)) {
        (req.params as Record<string, unknown>)[key] = value;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'params';
          return `${path}: ${issue.message}`;
        });
        res.status(400).json({
          success: false,
          message: 'Params validation failed',
          errors: errorDetails,
        });
        return;
      }
      next(error);
    }
  };
}
