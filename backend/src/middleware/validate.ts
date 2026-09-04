import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { badRequest } from '../utils/errors';

/**
 * Middleware factory: validates req.body against a Zod schema.
 * On failure, throws a structured AppError with field-level errors.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(badRequest('Validation failed', errors));
    }
    req.body = result.data;
    next();
  };
}

/**
 * Middleware factory: validates req.query against a Zod schema.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(badRequest('Invalid query parameters', errors));
    }
    req.query = result.data;
    next();
  };
}

/**
 * Middleware factory: validates req.params against a Zod schema.
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(badRequest('Invalid URL parameters', errors));
    }
    req.params = result.data;
    next();
  };
}
