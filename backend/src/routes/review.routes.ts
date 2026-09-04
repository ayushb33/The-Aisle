import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, parsePagination, buildPaginationMeta } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createReviewSchema } from '../validators';
import { notFound, badRequest } from '../utils/errors';

const router = Router();

// GET /api/reviews/product/:slug
router.get(
  '/product/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const { page, limit, skip } = parsePagination(req.query as any);

    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      throw notFound('Product not found');
    }

    const where = {
      productId: product.id,
      isApproved: true
    };

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, avatarUrl: true } }
        }
      })
    ]);

    sendSuccess(res, 200, {
      data: { reviews },
      meta: buildPaginationMeta(page, limit, total) as unknown as Record<string, unknown>
    });
  })
);

// POST /api/reviews
router.post(
  '/',
  authenticate,
  validateBody(createReviewSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { productId, rating, title, body } = req.body;
    const userId = req.userId as string;

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingReview) {
      throw badRequest('You have already reviewed this product');
    }

    // Verify if user bought the product
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED'
        }
      }
    });

    const isVerified = !!orderItem;

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        body,
        isVerified,
        isApproved: true // auto-approve for now, can be changed
      }
    });

    // Update product average rating
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true }
    });

    const reviewCount = allReviews.length;
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount;

    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount,
        avgRating
      }
    });

    sendSuccess(res, 201, {
      message: 'Review submitted successfully',
      data: { review }
    });
  })
);

export default router;
