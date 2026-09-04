import { z } from 'zod';

// ─── Auth Validators ────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Common Validators ──────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

// ─── Product Validators ─────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(500),
  description: z.string().optional(),
  shortDesc: z.string().max(300).optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  sku: z.string().max(100).optional(),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  categoryId: z.string().optional(),
  brand: z.string().max(200).optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Category Validators ────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(200),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Cart Validators ────────────────────────────────────────────

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// ─── Wishlist Validators ────────────────────────────────────────

export const createWishlistSchema = z.object({
  name: z.string().min(1, 'Wishlist name is required').max(200).default('Favorites'),
});

export const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// ─── Address Validators ─────────────────────────────────────────

export const createAddressSchema = z.object({
  label: z.string().max(50).default('Home'),
  fullName: z.string().min(1, 'Full name is required').max(200),
  phone: z.string().min(1, 'Phone is required').max(20),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(500),
  addressLine2: z.string().max(500).optional(),
  city: z.string().min(1, 'City is required').max(200),
  state: z.string().min(1, 'State is required').max(200),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

// ─── Order Validators ───────────────────────────────────────────

export const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Shipping address is required'),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

// ─── Review Validators ──────────────────────────────────────────

export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
});

// ─── Payment Validators ─────────────────────────────────────────

export const processPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  method: z.enum(['DEMO_CARD', 'DEMO_UPI', 'DEMO_NETBANKING', 'DEMO_WALLET']).default('DEMO_CARD'),
});
