import { Request, Response, NextFunction } from 'express';

interface RateLimitState {
  count: number;
  resetAt: number;
}

/**
 * Simple in-memory rate limiter per IP.
 * Not production-grade (use Redis for distributed), but suitable for demo/development.
 */
export function rateLimiter(windowMs: number, maxRequests: number) {
  const clients = new Map<string, RateLimitState>();

  // Periodic cleanup of expired entries
  setInterval(() => {
    const now = Date.now();
    for (const [ip, state] of clients) {
      if (state.resetAt <= now) clients.delete(ip);
    }
  }, windowMs);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const state = clients.get(ip);

    if (!state || state.resetAt <= now) {
      clients.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    state.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - state.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(state.resetAt / 1000));

    if (state.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  };
}
