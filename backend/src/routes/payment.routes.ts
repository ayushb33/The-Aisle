import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';
import { badRequest, notFound } from '../utils/errors';

const router = Router();
router.use(authenticate);

// POST /api/payments/process — simulate payment processing
router.post(
  '/process',
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId, paymentMethod = 'DEMO_CARD' } = req.body;
    if (!orderId) throw badRequest('orderId is required');

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order || order.userId !== req.userId!) {
      throw notFound('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw badRequest('Order is not in PENDING state');
    }

    // Simulate 1 second processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // We will simulate 10% failure rate for realism, or we can just always succeed. Let's succeed.
    const isSuccess = true;

    if (!isSuccess) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      });

      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          method: paymentMethod as any,
          status: 'FAILED',
          transactionId: 'TXN-FAIL-' + Date.now()
        }
      });

      throw badRequest('Payment failed');
    }

    // Success transaction
    const completedOrder = await prisma.$transaction(async (tx) => {
      // 1. Mark order as confirmed
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' }
      });

      // 2. Create Payment record
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          method: paymentMethod as any,
          status: 'COMPLETED',
          transactionId: 'TXN-' + Date.now()
        }
      });

      // 3. Deduct stock and increment sold count
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity }
          }
        });
      }

      // 4. Clear the cart
      const cart = await tx.cart.findFirst({ where: { userId: req.userId! } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return { ...updatedOrder, payment };
    });

    sendSuccess(res, 200, { message: 'Payment successful', data: { order: completedOrder } });
  })
);

export default router;
