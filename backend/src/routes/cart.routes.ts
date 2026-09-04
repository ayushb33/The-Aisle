import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { badRequest, notFound } from '../utils/errors';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

const cartInclude = {
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
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

type CartWithItems = Awaited<ReturnType<typeof prisma.cart.findFirst<{ include: typeof cartInclude }>>>;

function computeTotals(cart: CartWithItems) {
  if (!cart) return { subtotal: 0, itemCount: 0 };
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price.toString()) * item.quantity;
  }, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, itemCount };
}

async function getEnrichedCart(userId: string) {
  const cart = await prisma.cart.findFirst({ where: { userId }, include: cartInclude });
  if (!cart) return { items: [], subtotal: 0, itemCount: 0 };
  const { subtotal, itemCount } = computeTotals(cart);
  return { ...cart, subtotal, itemCount };
}

// GET /api/cart
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const cart = await getEnrichedCart(req.userId!);
    sendSuccess(res, 200, { data: { cart } });
  })
);

// POST /api/cart/items
router.post(
  '/items',
  asyncHandler(async (req: Request, res: Response) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) throw badRequest('productId is required');
    if (!Number.isInteger(quantity) || quantity < 1) throw badRequest('quantity must be a positive integer');

    const product = await prisma.product.findUnique({ where: { id: productId as string } });
    if (!product || !product.isActive) throw notFound('Product not found');
    if (product.stock < quantity) throw badRequest(`Only ${product.stock} units in stock`);

    // Get or create cart
    let cart = await prisma.cart.findFirst({ where: { userId: req.userId! } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.userId! } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: productId as string },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (product.stock < newQty) throw badRequest(`Only ${product.stock} units in stock`);
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId as string,
          quantity,
          priceAtAdd: product.price,
        },
      });
    }

    const enriched = await getEnrichedCart(req.userId!);
    sendSuccess(res, 200, { message: 'Item added to cart', data: { cart: enriched } });
  })
);

// PATCH /api/cart/items/:itemId
router.patch(
  '/items/:itemId',
  asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.itemId as string;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) throw badRequest('quantity must be a positive integer');

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });

    if (!item || item.cart.userId !== req.userId!) throw notFound('Cart item not found');
    if (item.product.stock < quantity) throw badRequest(`Only ${item.product.stock} units in stock`);

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

    const enriched = await getEnrichedCart(req.userId!);
    sendSuccess(res, 200, { message: 'Cart updated', data: { cart: enriched } });
  })
);

// DELETE /api/cart/items/:itemId
router.delete(
  '/items/:itemId',
  asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.itemId as string;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.userId!) throw notFound('Cart item not found');

    await prisma.cartItem.delete({ where: { id: itemId } });

    const enriched = await getEnrichedCart(req.userId!);
    sendSuccess(res, 200, { message: 'Item removed', data: { cart: enriched } });
  })
);

// DELETE /api/cart — clear
router.delete(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const cart = await prisma.cart.findFirst({ where: { userId: req.userId! } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    sendSuccess(res, 200, {
      message: 'Cart cleared',
      data: { cart: { items: [], subtotal: 0, itemCount: 0 } },
    });
  })
);

export default router;
