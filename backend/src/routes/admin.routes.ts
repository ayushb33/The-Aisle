import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, parsePagination, buildPaginationMeta } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, authorize } from '../middleware/auth';
import { badRequest } from '../utils/errors';
import catalogRoutes from './admin.catalog.routes';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, authorize('ADMIN'));

// Catalog Management (Products, Categories)
router.use('/catalog', catalogRoutes);

// GET /api/admin/dashboard — overview stats
router.get(
  '/dashboard',
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      revenueAgg,
      recentOrders,
      lowStockProducts,
      ordersByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { take: 1 },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: 5 } },
        orderBy: { stock: 'asc' },
        take: 5,
        select: { id: true, name: true, stock: true, images: { take: 1 } },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const totalRevenue = parseFloat(revenueAgg._sum.total?.toString() || '0');

    sendSuccess(res, 200, {
      data: {
        stats: {
          totalUsers,
          totalOrders,
          totalProducts,
          totalRevenue,
        },
        recentOrders,
        lowStockProducts,
        ordersByStatus,
      },
    });
  })
);

// GET /api/admin/users — list all users
router.get(
  '/users',
  asyncHandler(async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
    sendSuccess(res, 200, { data: { users } });
  })
);
// GET /api/admin/users/:id — get single user details
router.get(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: { product: { select: { images: { take: 1 } } } }
            }
          }
        },
      },
    });
    
    if (!user) throw badRequest('User not found');
    sendSuccess(res, 200, { data: { user } });
  })
);
// GET /api/admin/orders — list all orders
router.get(
  '/orders',
  asyncHandler(async (_req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        items: true,
      },
    });
    sendSuccess(res, 200, { data: { orders } });
  })
);
// GET /api/admin/orders/:id — get single order details
router.get(
  '/orders/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: {
            product: {
              select: { images: { take: 1 } }
            }
          }
        }
      },
    });

    if (!order) throw badRequest('Order not found');
    sendSuccess(res, 200, { data: { order } });
  })
);
// PATCH /api/admin/orders/:id/status — update order status
router.patch(
  '/orders/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { status },
    });
    sendSuccess(res, 200, { message: 'Order status updated', data: { order } });
  })
);

// GET /api/admin/reviews — list all reviews for moderation
router.get(
  '/reviews',
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as any);
    
    const [total, reviews] = await Promise.all([
      prisma.review.count(),
      prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          product: { select: { name: true, slug: true } }
        }
      })
    ]);
    
    sendSuccess(res, 200, {
      data: { reviews },
      meta: buildPaginationMeta(page, limit, total) as unknown as Record<string, unknown>
    });
  })
);

// PATCH /api/admin/reviews/:id/status — approve/reject review
router.patch(
  '/reviews/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { isApproved } = req.body;
    const review = await prisma.review.update({
      where: { id: req.params.id as string },
      data: { isApproved }
    });

    // Re-calculate product rating if needed
    if (review.productId) {
      const allReviews = await prisma.review.findMany({
        where: { productId: review.productId, isApproved: true },
        select: { rating: true }
      });
      const reviewCount = allReviews.length;
      const avgRating = reviewCount > 0 
        ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount
        : 0;
        
      await prisma.product.update({
        where: { id: review.productId },
        data: { reviewCount, avgRating }
      });
    }

    sendSuccess(res, 200, { message: 'Review status updated', data: { review } });
  })
);

// GET /api/admin/analytics — time-series & aggregated analytics
router.get(
  '/analytics',
  asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [rawOrders, topProducts, categoryRevenue, userGrowthRaw] = await Promise.all([
      // All orders in last 30 days (for revenue + order count per day)
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, total: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top 5 products by quantity sold
      prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),

      // Revenue by category via product join
      prisma.orderItem.findMany({
        where: { order: { createdAt: { gte: thirtyDaysAgo }, status: { notIn: ['CANCELLED'] } } },
        select: {
          quantity: true,
          totalPrice: true,
          product: { select: { category: { select: { name: true } } } },
        },
      }),

      // New users per day in last 30 days
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Build a map of date → { revenue, orders }
    const revenueMap: Record<string, { revenue: number; orders: number }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      revenueMap[key] = { revenue: 0, orders: 0 };
    }

    for (const order of rawOrders) {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (revenueMap[key] && order.status !== 'CANCELLED') {
        revenueMap[key].revenue += parseFloat(order.total.toString());
        revenueMap[key].orders += 1;
      }
    }

    const dailyRevenue = Object.entries(revenueMap).map(([date, val]) => ({
      date,
      revenue: parseFloat(val.revenue.toFixed(2)),
      orders: val.orders,
    }));

    // Category breakdown
    const catMap: Record<string, number> = {};
    for (const item of categoryRevenue) {
      const catName = item.product?.category?.name ?? 'Uncategorized';
      const lineTotal = parseFloat(item.totalPrice.toString());
      catMap[catName] = (catMap[catName] || 0) + lineTotal;
    }
    const categoryBreakdown = Object.entries(catMap)
      .map(([name, revenue]) => ({ name, revenue: parseFloat(revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue);

    // Customer growth per day
    const growthMap: Record<string, number> = {};
    for (const key of Object.keys(revenueMap)) growthMap[key] = 0;
    for (const u of userGrowthRaw) {
      const key = new Date(u.createdAt).toISOString().slice(0, 10);
      if (growthMap[key] !== undefined) growthMap[key]++;
    }
    const customerGrowth = Object.entries(growthMap).map(([date, newUsers]) => ({ date, newUsers }));

    // Top products
    const topProductsList = topProducts.map((p) => ({
      name: p.productName,
      qty: p._sum?.quantity ?? 0,
    }));

    sendSuccess(res, 200, {
      data: { dailyRevenue, categoryBreakdown, customerGrowth, topProducts: topProductsList },
    });
  })
);

export default router;

