import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { badRequest, notFound } from '../utils/errors';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();
router.use(authenticate);

// Generate a random order number
function generateOrderNumber() {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// POST /api/orders/checkout — convert cart to a PENDING order
router.post(
  '/checkout',
  asyncHandler(async (req: Request, res: Response) => {
    const { addressId, notes } = req.body;

    // Get active cart
    const cart = await prisma.cart.findFirst({
      where: { userId: req.userId! },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw badRequest('Cart is empty');
    }

    // Verify stock and compute totals
    let subtotal = 0;
    for (const item of cart.items) {
      if (!item.product.isActive || item.product.stock < item.quantity) {
        throw badRequest(`Product "${item.product.name}" is out of stock or unavailable.`);
      }
      subtotal += parseFloat(item.product.price.toString()) * item.quantity;
    }

    const shippingCost = subtotal >= 999 ? 0 : 99;
    const taxes = Math.round(subtotal * 0.18); // 18% GST simulation
    const total = subtotal + shippingCost + taxes;

    // Fetch address if provided
    let shippingAddress = null;
    if (addressId) {
      const address = await prisma.address.findUnique({ where: { id: addressId } });
      if (address && address.userId === req.userId) {
        shippingAddress = address; // snapshot
      }
    }

    // Create the order and items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.userId!,
          addressId: addressId || null,
          shippingAddress: shippingAddress as any,
          subtotal,
          shippingCost,
          discount: 0,
          total,
          notes,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productImage: item.product.images?.[0]?.url || null,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: parseFloat(item.product.price.toString()) * item.quantity,
            }))
          }
        },
        include: { items: true }
      });

      return newOrder;
    });

    sendSuccess(res, 201, { message: 'Order created', data: { order } });
  })
);

// GET /api/orders — list user orders
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    sendSuccess(res, 200, { data: { orders } });
  })
);

// GET /api/orders/:id — get order details
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: { items: true, payment: true }
    });

    if (!order || order.userId !== req.userId!) throw notFound('Order not found');

    sendSuccess(res, 200, { data: { order } });
  })
);

export default router;
