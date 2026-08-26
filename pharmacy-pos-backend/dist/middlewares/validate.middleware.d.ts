import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare function validateBody(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function validateQuery(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function validateParams(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => Promise<void>;
