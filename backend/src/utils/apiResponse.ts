import { Response } from 'express';

// ─── Standard API Response Helpers ──────────────────────────────
// These ensure every API response follows a consistent shape.

interface SuccessResponseOptions {
  data?: unknown;
  message?: string;
  meta?: Record<string, unknown>;
}

interface ErrorResponseOptions {
  message: string;
  errors?: unknown;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Send a success response (2xx)
 */
export function sendSuccess(res: Response, status: number, options: SuccessResponseOptions = {}) {
  const { data, message, meta } = options;
  const body: Record<string, unknown> = { success: true };
  if (message) body.message = message;
  if (data !== undefined) body.data = data;
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

/**
 * Send an error response (4xx / 5xx)
 */
export function sendError(res: Response, status: number, options: ErrorResponseOptions) {
  const { message, errors } = options;
  const body: Record<string, unknown> = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
}

/**
 * Build pagination meta from count + query params
 */
export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Parse page & limit from query string with safe defaults
 */
export function parsePagination(query: { page?: string; limit?: string }) {
  let page = parseInt(query.page || '1', 10);
  let limit = parseInt(query.limit || '20', 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100; // hard cap
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
