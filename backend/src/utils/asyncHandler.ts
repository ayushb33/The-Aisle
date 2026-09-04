import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler so thrown errors are forwarded to next().
 * Eliminates try/catch boilerplate in every controller.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
