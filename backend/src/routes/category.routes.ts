import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, parsePagination, buildPaginationMeta } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { notFound } from '../utils/errors';

const router = Router();

// GET /api/categories
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    
    sendSuccess(res, 200, { data: { categories } });
  })
);

// GET /api/categories/:slug
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    
    const category = await prisma.category.findUnique({
      where: { slug },
    });
    
    if (!category || !category.isActive) {
      throw notFound('Category not found');
    }
    
    sendSuccess(res, 200, { data: { category } });
  })
);

export default router;
