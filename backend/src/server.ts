import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { prisma } from './lib/prisma';
import { sendSuccess, sendError } from './utils/apiResponse';

// Route imports
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import addressRoutes from './routes/address.routes';
import adminRoutes from './routes/admin.routes';
import reviewRoutes from './routes/review.routes';

const app: Express = express();

// Enable trust proxy for reverse proxies (Render, Cloudflare, etc.) — required for secure cookies
app.set('trust proxy', 1);

// Flexible CORS setup supporting single URL, comma-separated URLs, or Vercel preview apps
const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, cron jobs, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Allow vercel deployment URLs dynamically
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, origin);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use(rateLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests));

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.removeHeader('X-Powered-By');
  next();
});

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess(res, 200, {
      message: 'The Aisle API is operational',
      data: {
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        database: 'connected',
      },
    });
  } catch {
    sendSuccess(res, 200, {
      message: 'The Aisle API is running (database unreachable)',
      data: {
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        database: 'disconnected',
      },
    });
  }
});

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// ─── 404 Handler ────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  sendError(res, 404, {
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ───────────────────────────────────────
app.use(errorHandler);

// ─── Server Start ───────────────────────────────────────────────
const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n[The Aisle Server] ✓ Running on port ${PORT} in ${config.nodeEnv} mode`);
    console.log(`[The Aisle Server] ✓ Health check: http://localhost:${PORT}/api/health`);
    console.log(`[The Aisle Server] ✓ API routes registered:\n`);
    console.log('  /api/auth');
    console.log('  /api/products');
    console.log('  /api/categories');
    console.log('  /api/cart');
    console.log('  /api/wishlists');
    console.log('  /api/orders');
    console.log('  /api/payments');
    console.log('  /api/reviews');
    console.log('  /api/admin\n');
  });
}

export default app;
