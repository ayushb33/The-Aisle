import { config } from '../config';

/**
 * Custom error class for known application errors.
 * These are intentional errors (validation failures, not-found, etc.)
 * and should not be logged as unexpected server errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ─── Convenience Factory Functions ──────────────────────────────

export function badRequest(message = 'Bad request', errors?: unknown) {
  return new AppError(message, 400, errors);
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError(message, 401);
}

export function forbidden(message = 'Forbidden') {
  return new AppError(message, 403);
}

export function notFound(message = 'Resource not found') {
  return new AppError(message, 404);
}

export function conflict(message = 'Resource already exists') {
  return new AppError(message, 409);
}

export function tooMany(message = 'Too many requests') {
  return new AppError(message, 429);
}

export function internal(message?: string) {
  const msg = config.isProduction ? 'Internal server error' : (message || 'Internal server error');
  return new AppError(msg, 500);
}
