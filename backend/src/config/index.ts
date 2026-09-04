import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: 'aisle_token',
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  databaseUrl: process.env.DATABASE_URL || '',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,
  },
};
