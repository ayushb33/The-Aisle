# Deployment Guide: The Aisle E-Commerce Application

This guide outlines the steps to deploy **The Aisle** web application using:
- **Backend**: Render (Web Service)
- **Frontend**: Vercel
- **Database**: Aiven (PostgreSQL - already configured)
- **Keep-Alive**: cron-job.org / UptimeRobot (HTTP ping to keep Render active)

---

## 1. Database (Aiven PostgreSQL)

Ensure your Aiven PostgreSQL URI has `sslmode=require`:
`postgres://<username>:<password>@<aiven-host>:<port>/<dbname>?sslmode=require`

---

## 2. Backend Deployment (Render)

1. **New Web Service**:
   - Log in to [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.

2. **Configuration Settings**:
   - **Name**: `the-aisle-api` (or preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables on Render**:
   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `postgres://<user>:<pass>@<host>:<port>/<dbname>?sslmode=require` |
   | `CORS_ORIGIN` | `https://<your-app>.vercel.app` *(update once Vercel URL is known)* |
   | `JWT_SECRET` | `<your-secure-random-secret-key>` |
   | `JWT_EXPIRES_IN` | `7d` |

---

## 3. Frontend Deployment (Vercel)

1. **Import Project**:
   - Log in to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository.

2. **Configuration Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables on Vercel**:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-render-app>.onrender.com/api` |

---

## 4. Keep-Alive Cron Job (Render Free Tier)

Render free web services sleep after 15 minutes of inactivity. To keep your backend warm and responsive:

### Option A: Free Cron Service (Recommended: cron-job.org or UptimeRobot)
1. Sign up for a free account at [cron-job.org](https://cron-job.org/) or [UptimeRobot](https://uptimerobot.com/).
2. Create a new HTTP cron job:
   - **URL**: `https://<your-render-app>.onrender.com/api/health`
   - **Method**: `GET`
   - **Schedule**: Every 10 or 14 minutes (`*/10 * * * *` or `*/14 * * * *`)
3. Save and enable the job. This continuously pings `/api/health`, preventing Render from spinning down.

---

## 5. Deployment Verification Checklist

- [x] **Frontend Builds cleanly** (`tsc -b && vite build` verified).
- [x] **Backend Builds cleanly** (`npx prisma generate && tsc` verified).
- [x] **Vercel SPA Routing configured** (`frontend/vercel.json` added).
- [x] **Render Proxy & Cross-Origin Cookies enabled** (`app.set('trust proxy', 1)` and dynamic CORS origin support added in `backend/src/server.ts`).
- [x] **API Base URL configured dynamically** (`import.meta.env.VITE_API_URL` enabled in `frontend/src/lib/api.ts`).
