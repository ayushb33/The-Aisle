import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { badRequest, notFound } from '../utils/errors';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

const wishlistInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          comparePrice: true,
          stock: true,
          images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
        }
      }
    },
    orderBy: { createdAt: 'desc' as const }
  }
} as const;

// GET /api/wishlists — list all user wishlists
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    let wishlists = await prisma.wishlist.findMany({
      where: { userId: req.userId! },
      include: wishlistInclude,
      orderBy: { createdAt: 'asc' }
    });

    if (wishlists.length === 0) {
      // Create a default wishlist if none exist
      const defaultWishlist = await prisma.wishlist.create({
        data: { userId: req.userId!, name: 'Favorites' },
        include: wishlistInclude
      });
      wishlists = [defaultWishlist];
    }

    sendSuccess(res, 200, { data: { wishlists } });
  })
);

// POST /api/wishlists — create new wishlist
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string') throw badRequest('Wishlist name is required');

    const wishlist = await prisma.wishlist.create({
      data: { userId: req.userId!, name },
      include: wishlistInclude
    });

    sendSuccess(res, 201, { message: 'Wishlist created', data: { wishlist } });
  })
);

// PATCH /api/wishlists/:id — rename wishlist
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name } = req.body;
    if (!name || typeof name !== 'string') throw badRequest('Wishlist name is required');

    const existing = await prisma.wishlist.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId!) throw notFound('Wishlist not found');

    const wishlist = await prisma.wishlist.update({
      where: { id },
      data: { name },
      include: wishlistInclude
    });

    sendSuccess(res, 200, { message: 'Wishlist renamed', data: { wishlist } });
  })
);

// DELETE /api/wishlists/:id — delete wishlist
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const existing = await prisma.wishlist.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId!) throw notFound('Wishlist not found');

    await prisma.wishlist.delete({ where: { id } });

    sendSuccess(res, 200, { message: 'Wishlist deleted' });
  })
);

// POST /api/wishlists/:id/items — add product to wishlist
router.post(
  '/:id/items',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { productId } = req.body;

    if (!productId) throw badRequest('productId is required');

    const existingWishlist = await prisma.wishlist.findUnique({ where: { id } });
    if (!existingWishlist || existingWishlist.userId !== req.userId!) throw notFound('Wishlist not found');

    const product = await prisma.product.findUnique({ where: { id: productId as string } });
    if (!product || !product.isActive) throw notFound('Product not found');

    const existingItem = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: id, productId: productId as string } }
    });

    if (existingItem) {
      throw badRequest('Product is already in this wishlist');
    }

    await prisma.wishlistItem.create({
      data: { wishlistId: id, productId: productId as string }
    });

    const wishlist = await prisma.wishlist.findUnique({
      where: { id },
      include: wishlistInclude
    });

    sendSuccess(res, 200, { message: 'Product added to wishlist', data: { wishlist } });
  })
);

// DELETE /api/wishlists/:id/items/:productId — remove product from wishlist
router.delete(
  '/:id/items/:productId',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const productId = req.params.productId as string;

    const existingWishlist = await prisma.wishlist.findUnique({ where: { id } });
    if (!existingWishlist || existingWishlist.userId !== req.userId!) throw notFound('Wishlist not found');

    const existingItem = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: id, productId } }
    });

    if (!existingItem) {
      throw notFound('Product not found in wishlist');
    }

    await prisma.wishlistItem.delete({
      where: { wishlistId_productId: { wishlistId: id, productId } }
    });

    const wishlist = await prisma.wishlist.findUnique({
      where: { id },
      include: wishlistInclude
    });

    sendSuccess(res, 200, { message: 'Product removed from wishlist', data: { wishlist } });
  })
);

export default router;
