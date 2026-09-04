import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/apiResponse';
import { config } from '../config';

/**
 * Global error handling middleware.
 * Catches AppError, ZodError, Prisma errors, and unexpected errors.
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // ─── AppError (known operational errors) ────────────
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, {
      message: err.message,
      errors: err.errors,
    });
  }

  // ─── Zod Validation Error ──────────────────────────
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 400, {
      message: 'Validation failed',
      errors: formatted,
    });
  }

  // ─── Prisma Known Errors ──────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[]) || [];
        return sendError(res, 409, {
          message: `A record with this ${target.join(', ')} already exists.`,
        });
      }
      case 'P2025':
        return sendError(res, 404, { message: 'Record not found.' });
      case 'P2003':
        return sendError(res, 400, { message: 'Invalid reference. Related record does not exist.' });
      default:
        console.error(`[Prisma Error ${err.code}]:`, err.message);
        return sendError(res, 500, {
          message: config.isProduction ? 'Database error' : `Prisma error: ${err.code}`,
        });
    }
  }

  // ─── Unexpected Error ─────────────────────────────
  console.error('[Unhandled Error]:', err);
  return sendError(res, 500, {
    message: config.isProduction ? 'Internal server error' : err.message || 'Internal server error',
  });
}
