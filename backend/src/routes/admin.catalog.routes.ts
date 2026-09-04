import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { badRequest, notFound } from '../utils/errors';

const router = Router();

// All catalog routes require authentication + ADMIN role
router.use(authenticate, authorize('ADMIN'));

// ─── Categories ──────────────────────────────────────────────────

// GET /api/admin/catalog/categories
router.get(
  '/categories',
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } }
      }
    });
    sendSuccess(res, 200, { data: { categories } });
  })
);

// POST /api/admin/catalog/categories
router.post(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, description, imageUrl, isActive, sortOrder } = req.body;
    
    if (!name || !slug) throw badRequest('Name and slug are required');
    
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw badRequest('Category with this slug already exists');

    const category = await prisma.category.create({
      data: { name, slug, description, imageUrl, isActive, sortOrder: sortOrder || 0 }
    });

    sendSuccess(res, 201, { message: 'Category created', data: { category } });
  })
);

// PATCH /api/admin/catalog/categories/:id
router.patch(
  '/categories/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, slug, description, imageUrl, isActive, sortOrder } = req.body;
    
    if (slug) {
      const existing = await prisma.category.findFirst({ where: { slug, id: { not: id } } });
      if (existing) throw badRequest('Category with this slug already exists');
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, imageUrl, isActive, sortOrder }
    });

    sendSuccess(res, 200, { message: 'Category updated', data: { category } });
  })
);

// DELETE /api/admin/catalog/categories/:id
router.delete(
  '/categories/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await prisma.category.delete({ where: { id } });
    sendSuccess(res, 200, { message: 'Category deleted' });
  })
);

// ─── Products ────────────────────────────────────────────────────

// GET /api/admin/catalog/products
router.get(
  '/products',
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          images: { take: 1 }
        }
      }),
      prisma.product.count({ where })
    ]);

    sendSuccess(res, 200, {
      data: {
        products,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });
  })
);

// GET /api/admin/catalog/products/:id
router.get(
  '/products/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true
      }
    });
    
    if (!product) throw notFound('Product not found');
    sendSuccess(res, 200, { data: { product } });
  })
);

// POST /api/admin/catalog/products
router.post(
  '/products',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      name, slug, description, shortDesc, price, comparePrice, costPrice,
      sku, stock, lowStockThreshold, categoryId, brand, isFeatured,
      isNewArrival, isActive, images
    } = req.body;

    if (!name || !slug || !price) throw badRequest('Name, slug, and price are required');

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) throw badRequest('Product with this slug already exists');
    
    if (sku) {
       const existingSku = await prisma.product.findUnique({ where: { sku } });
       if (existingSku) throw badRequest('Product with this SKU already exists');
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description, shortDesc, price, comparePrice, costPrice,
        sku, stock: stock || 0, lowStockThreshold: lowStockThreshold || 5,
        categoryId, brand, isFeatured, isNewArrival, isActive,
        images: images && images.length > 0 ? {
          create: images.map((url: string, index: number) => ({ url, sortOrder: index }))
        } : undefined
      },
      include: { images: true }
    });

    sendSuccess(res, 201, { message: 'Product created', data: { product } });
  })
);

// PATCH /api/admin/catalog/products/:id
router.patch(
  '/products/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
      name, slug, description, shortDesc, price, comparePrice, costPrice,
      sku, stock, lowStockThreshold, categoryId, brand, isFeatured,
      isNewArrival, isActive, images
    } = req.body;
    
    if (slug) {
      const existing = await prisma.product.findFirst({ where: { slug, id: { not: id } } });
      if (existing) throw badRequest('Product with this slug already exists');
    }

    if (sku) {
      const existingSku = await prisma.product.findFirst({ where: { sku, id: { not: id } } });
      if (existingSku) throw badRequest('Product with this SKU already exists');
    }

    // Process images if provided
    let imagesUpdate;
    if (images) {
      imagesUpdate = {
        deleteMany: {}, // Delete all existing images
        create: images.map((url: string, index: number) => ({ url, sortOrder: index }))
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name, slug, description, shortDesc, price, comparePrice, costPrice,
        sku, stock, lowStockThreshold, categoryId, brand, isFeatured,
        isNewArrival, isActive,
        images: imagesUpdate
      },
      include: { images: true }
    });

    sendSuccess(res, 200, { message: 'Product updated', data: { product } });
  })
);

// DELETE /api/admin/catalog/products/:id
router.delete(
  '/products/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await prisma.product.delete({ where: { id } });
    sendSuccess(res, 200, { message: 'Product deleted' });
  })
);

export default router;
