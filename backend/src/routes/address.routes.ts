import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { badRequest, notFound } from '../utils/errors';

const router = Router();
router.use(authenticate);

// GET /api/addresses
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId! },
      orderBy: { isDefault: 'desc' }
    });
    sendSuccess(res, 200, { data: { addresses } });
  })
);

// POST /api/addresses
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { label, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = req.body;

    if (!fullName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
      throw badRequest('Please provide all required address fields');
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.userId! },
        data: { isDefault: false }
      });
    }

    const addressCount = await prisma.address.count({ where: { userId: req.userId! } });

    const address = await prisma.address.create({
      data: {
        userId: req.userId!,
        label: label || 'Home',
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || addressCount === 0
      }
    });

    sendSuccess(res, 201, { message: 'Address added successfully', data: { address } });
  })
);

// PATCH /api/addresses/:id
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { label, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = req.body;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId!) throw notFound('Address not found');

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.userId! },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        label,
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault
      }
    });

    sendSuccess(res, 200, { message: 'Address updated', data: { address } });
  })
);

// DELETE /api/addresses/:id
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId!) throw notFound('Address not found');

    await prisma.address.delete({ where: { id } });

    sendSuccess(res, 200, { message: 'Address deleted' });
  })
);

export default router;
