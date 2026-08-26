import { ZodError } from 'zod';
export function validateBody(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
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
export function validateQuery(schema) {
    return async (req, res, next) => {
        try {
            const validated = (await schema.parseAsync(req.query));
            for (const [key, value] of Object.entries(validated)) {
                req.query[key] = value;
            }
            next();
        }
        catch (error) {
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
export function validateParams(schema) {
    return async (req, res, next) => {
        try {
            const validated = (await schema.parseAsync(req.params));
            for (const [key, value] of Object.entries(validated)) {
                req.params[key] = value;
            }
            next();
        }
        catch (error) {
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
//# sourceMappingURL=validate.middleware.js.map