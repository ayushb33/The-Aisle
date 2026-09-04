import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError, parsePagination, buildPaginationMeta } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { notFound } from '../utils/errors';

const router = Router();

// GET /api/products
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as any);
    
    const { category, search, sort } = req.query;
    
    const where: any = { isActive: true };
    
    if (category) {
      where.category = { slug: String(category) };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { soldCount: 'desc' };
    
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1
          },
          category: { select: { name: true, slug: true } }
        }
      })
    ]);
    
    sendSuccess(res, 200, {
      data: { products },
      meta: buildPaginationMeta(page, limit, total) as unknown as Record<string, unknown>
    });
  })
);

// GET /api/products/:slug
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { name: true, slug: true } },
        variants: { where: { isActive: true } },
        specifications: { orderBy: { sortOrder: 'asc' } }
      }
    });
    
    if (!product || !product.isActive) {
      throw notFound('Product not found');
    }
    
    sendSuccess(res, 200, { data: { product } });
  })
);

export default router;
