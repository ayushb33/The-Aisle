import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { unauthorized, forbidden } from '../utils/errors';
import { Role } from '@prisma/client';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: Role;
    }
  }
}

interface JwtPayload {
  userId: string;
  role: Role;
}

/**
 * Authenticate: verifies JWT from cookie or Authorization header.
 * Attaches userId and userRole to req.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // Try cookie first, then Authorization header
    const token =
      req.cookies?.[config.cookieName] ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw unauthorized('Authentication required');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(unauthorized('Invalid or expired token'));
    } else {
      next(err);
    }
  }
}

/**
 * Optional authenticate: same as authenticate but does NOT fail if no token present.
 * If token exists and is valid, attaches user info. Otherwise, continues silently.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token =
      req.cookies?.[config.cookieName] ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    // Token exists but invalid — continue as unauthenticated
    next();
  }
}

/**
 * Authorize: requires a specific role.
 * Must be used after authenticate.
 */
export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.userId || !req.userRole) {
      return next(unauthorized('Authentication required'));
    }
    if (!roles.includes(req.userRole)) {
      return next(forbidden('Insufficient permissions'));
    }
    next();
  };
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: string, role: Role): string {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as any);
}

/**
 * Set auth token in HTTP-only cookie
 */
export function setAuthCookie(res: Response, token: string) {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    maxAge: config.cookieMaxAge,
    path: '/',
  });
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(res: Response) {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/',
  });
}
