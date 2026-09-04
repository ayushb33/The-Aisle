import { Router, Request, Response } from 'express';
import argon2 from 'argon2';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators';
import { generateToken, setAuthCookie, clearAuthCookie, authenticate } from '../middleware/auth';
import { badRequest, unauthorized } from '../utils/errors';
import { Role } from '@prisma/client';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw badRequest('A user with this email already exists');
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token and set cookie
    const token = generateToken(user.id, user.role);
    setAuthCookie(res, token);

    sendSuccess(res, 201, {
      message: 'Registration successful',
      data: { user },
    });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw unauthorized('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw unauthorized('Invalid email or password');
    }

    // Generate token and set cookie
    const token = generateToken(user.id, user.role);
    setAuthCookie(res, token);

    const { passwordHash, ...userWithoutPassword } = user;

    sendSuccess(res, 200, {
      message: 'Login successful',
      data: { user: userWithoutPassword },
    });
  })
);

// POST /api/auth/logout
router.post(
  '/logout',
  asyncHandler(async (_req: Request, res: Response) => {
    clearAuthCookie(res);
    sendSuccess(res, 200, { message: 'Logout successful' });
  })
);

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw unauthorized('User not found');
    }

    sendSuccess(res, 200, {
      data: { user },
    });
  })
);

// PATCH /api/auth/profile
router.patch(
  '/profile',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { firstName, lastName, phone },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    sendSuccess(res, 200, {
      message: 'Profile updated successfully',
      data: { user },
    });
  })
);

// PATCH /api/auth/password
router.patch(
  '/password',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) throw unauthorized('User not found');

    const isValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isValid) throw badRequest('Invalid current password');

    const passwordHash = await argon2.hash(newPassword);
    await prisma.user.update({
      where: { id: req.userId },
      data: { passwordHash }
    });

    sendSuccess(res, 200, { message: 'Password updated successfully' });
  })
);

export default router;
