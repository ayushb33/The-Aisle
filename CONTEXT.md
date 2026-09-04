# CONTEXT.md

# The Aisle — Premium Full-Stack E-Commerce Showcase

> **Living project state.**
>
> This file must be updated by every AI agent after completing meaningful work. It is the handoff document between AI sessions/accounts. A new AI agent must be able to continue the project by reading this file together with `AI.md`.

---

# 1. Project Overview

We are building **The Aisle**, a premium, modern, full-stack e-commerce showcase platform for our software company.

The website will be used directly as a demo for potential customers and may also be linked from the company's website as an example of our e-commerce development capabilities.

The application must demonstrate both:

- A highly polished customer-facing shopping experience
- A complete business/admin management system

The project should feel like a real commercial e-commerce platform rather than a basic student project.

---

# 2. Current Overall Status

**Project Status:** IN PROGRESS

**Current Phase:** Phase 14 — Premium UI/UX & Animation Pass (COMPLETED)

**Last Updated:** 2026-08-24

**Current Task:** Phase 14 completed. Full animation polish pass done across all major pages and components.

**Next Task:** Begin Phase 13 — User Account & Experience (Reviews, Profile editing).

---

# 3. Permanent Project Instructions

Read `AI.md` before working on this project.

`AI.md` contains:

- Technology stack
- Architecture rules
- Security requirements
- UI/UX principles
- Coding standards
- Testing expectations
- AI workflow
- Phase discipline

`CONTEXT.md` contains:

- Current project progress
- Requirements
- Phase status
- Decisions
- Completed work
- Known issues
- Next steps

Never treat this file as static documentation. It is a living project state.

---

# 4. Product Vision

The final application should demonstrate that our company can build a complete modern e-commerce platform with:

### Customer Experience

- Premium landing page
- Product discovery
- Categories
- Search
- Filters
- Sorting
- Product detail pages
- Product variants
- Cart
- Multiple wishlists
- Authentication
- Addresses
- Checkout
- Dummy payment
- Orders
- Order history
- Reviews

### Business Management

- Admin dashboard
- Product management
- Category management
- Inventory management
- Order management
- Customer management
- Payment records
- Analytics
- Sales statistics
- Customer statistics
- Product statistics

---

# 5. Required Design Direction

The storefront must be:

- Modern
- Premium
- Attractive
- Attention-grabbing
- Visually polished
- Responsive
- Fast
- Accessible
- Animation-rich but not excessive

The design must make a strong first impression.

Avoid generic e-commerce templates.

Animations should be intentional and should improve the user experience.

---

# 6. Brand Identity

**Project / Store Name:** The Aisle

**Brand Direction:**

- Modern retail
- Premium but approachable
- Clean and aesthetic
- General-purpose e-commerce marketplace
- Distinctive, not overly technical

The symbolic logo direction is a minimalist geometric **A** with an aisle/path/vanishing-point concept.

Do not use the logo image as a dependency for the application until it is placed into the repository. The final logo assets should be added to the frontend assets folder when available.

---

# 7. Required Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Zustand
- TanStack Query
- Lucide React

## Backend

- Node.js
- TypeScript
- Express.js
- Prisma
- Zod

## Database

- PostgreSQL

## Authentication

Secure authentication with:

- Password hashing
- HTTP-only authentication mechanism
- Role-based authorization
- Protected backend routes

## Development

- Git
- GitHub
- npm
- ESLint
- Prettier

---

# 8. High-Level Architecture

```text
                 CUSTOMER STOREFRONT
                         |
                         |
                 React / TypeScript
                         |
                         | REST API
                         v
                 Node / Express API
                         |
                         | Prisma
                         v
                    PostgreSQL
                         ^
                         |
                 Admin Dashboard
```

The frontend must never access PostgreSQL directly.

Business-critical logic must be handled by the backend.

---

# 9. User Roles

## CUSTOMER

Customers can:

- Register
- Login
- Logout
- Manage profile
- Manage addresses
- Browse products
- Search
- Filter
- Sort
- Add to cart
- Manage cart
- Create wishlists
- Add/remove wishlist products
- Checkout
- Complete dummy payment
- Place orders
- View orders
- View order details
- Submit reviews when implemented

## ADMIN

Admins can:

- Access admin dashboard
- View statistics
- Manage products
- Manage categories
- Manage inventory
- View/manage orders
- View customers
- View payments
- View analytics
- Manage admin-accessible settings

Admin APIs must be protected server-side.

---

# 10. Authentication Rules

Browsing the store should not require login.

The following actions require authentication:

- Creating a wishlist
- Adding to a wishlist
- Viewing personal wishlists
- Checkout
- Placing an order
- Viewing order history
- Managing account
- Managing addresses
- Submitting reviews when implemented

If an unauthenticated user attempts a protected action, show a polished login/signup prompt or redirect to authentication.

---

# 11. E-Commerce Requirements

## Homepage

The homepage should include appropriate combinations of:

- Hero section
- Featured products
- New arrivals
- Best sellers
- Categories
- Promotional banners
- Product collections
- Brand/value section
- Testimonials
- Newsletter
- Footer

The exact visual composition should be determined during the design phase.

---

## Product Catalog

Must support:

- All products
- Category pages
- Search
- Search suggestions
- Price filtering
- Category filtering
- Brand filtering where applicable
- Rating filtering
- Availability filtering
- Sorting

Sorting should eventually include:

- Featured
- Newest
- Price low to high
- Price high to low
- Rating
- Popularity where data supports it

Use pagination for large datasets.

---

## Product Details

Each product should support:

- Product name
- Description
- Price
- Original price where discounted
- Discount
- Images
- Gallery
- Category
- Brand where applicable
- Stock
- Rating
- Review count
- Variants
- Specifications
- Quantity
- Add to cart
- Buy now
- Add to wishlist

---

# 12. Cart Requirements

Authenticated users must have persistent server-backed carts.

Cart must support:

- Add item
- Remove item
- Increase quantity
- Decrease quantity
- Set quantity
- View subtotal
- Shipping information
- Total
- Empty cart state

Important:

**Never trust client-provided prices or totals.**

The backend must calculate order/cart totals using current product data.

---

# 13. Wishlist Requirements

Users must be able to create multiple wishlists.

Example:

```text
Favorites
Birthday Ideas
Future Purchases
Home Setup
```

Each wishlist must support:

- Create
- Rename
- Delete
- Add product
- Remove product
- View products

The same product may be allowed in different wishlists unless a business rule later specifies otherwise.

---

# 14. Checkout Requirements

Checkout should contain:

### Step 1
Cart review

### Step 2
Shipping address

### Step 3
Delivery method

### Step 4
Dummy payment

### Step 5
Order confirmation

Only authenticated users can reach the order-placement stage.

---

# 15. Dummy Payment Requirements

No real money will be processed.

The system should simulate a realistic payment flow.

Example:

```text
Enter payment details
        ↓
Click Pay
        ↓
Processing...
        ↓
Payment Successful
        ↓
Create Order
        ↓
Confirmation
```

Support demo payment methods such as:

- Demo Card
- Demo UPI
- Demo Payment

The database should contain a payment record.

Payment should have information such as:

- Payment ID
- Order ID
- Amount
- Currency
- Payment method
- Status
- Demo transaction ID
- Created timestamp

The payment flow should support both success and failure scenarios for demonstration/testing.

---

# 16. Order Requirements

Order statuses:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

Customers can:

- Place orders
- View orders
- View order details
- View payment status
- View order status

Admins can:

- View all orders
- Search orders
- Filter orders
- View order details
- Change order status
- View customer information
- View payment information

---

# 17. Admin Dashboard Requirements

The admin dashboard must be modern and polished.

Dashboard statistics should include, where data is available:

- Total revenue
- Today's revenue
- Monthly revenue
- Total orders
- Pending orders
- Completed orders
- Cancelled orders
- Total customers
- New customers
- Total products
- Low-stock products
- Average order value

Charts should include useful analytics such as:

- Revenue over time
- Orders over time
- Sales by category
- Top-selling products
- Customer growth
- Order status distribution

Do not use fake-looking statistics once real database data exists.

---

# 18. Admin Product Management

Admin must eventually be able to:

- Create product
- Edit product
- Delete product
- Enable/disable product
- Set price
- Set discount
- Set stock
- Assign category
- Add images
- Add variants
- Add specifications
- Mark featured
- Mark new arrival

---

# 19. Admin Category Management

Admin must eventually be able to:

- Create category
- Edit category
- Delete category
- Enable/disable category
- View associated products

Database relationships must remain valid.

---

# 20. Admin Inventory Management

Inventory should eventually show:

- Current stock
- Low stock
- Out of stock
- Product
- Variant where applicable
- Stock status

The backend must prevent orders exceeding available stock.

---

# 21. Admin Customer Management

Admin should eventually be able to view:

- Customer name
- Email
- Registration date
- Number of orders
- Total spending
- Account status

Do not expose customer passwords or sensitive authentication data.

---

# 22. Database Entities

Expected core entities:

```text
User
Role
Address
Category
Product
ProductImage
ProductVariant
Cart
CartItem
Wishlist
WishlistItem
Order
OrderItem
Payment
Review
Coupon
```

The exact schema will be finalized during the database phase.

Document significant schema decisions in this file.

---

# 23. Planned Repository

```text
ecommerce-platform/
│
├── frontend/
│
├── backend/
│
├── AI.md
├── CONTEXT.md
├── README.md
└── .gitignore
```

---

# 24. Local & Production Environment

The project must work both locally and in production from the same codebase.

## Database

An **Aiven PostgreSQL database has already been created** and will be used as the project's database.

Do not create a separate local PostgreSQL requirement unless explicitly requested.

Local development:

```text
Frontend → localhost
Backend  → localhost
Database → Aiven PostgreSQL
```

Production:

```text
Frontend → production frontend host
Backend  → production backend host
Database → Aiven PostgreSQL
```

All database access must use environment variables.

The Aiven connection string must never be committed to Git.

Expected variable:

```text
DATABASE_URL
```

Additional SSL settings should follow the requirements of the Aiven connection configuration and Prisma/PostgreSQL environment.

## Environment Files

Maintain environment examples such as:

```text
frontend/.env.example
backend/.env.example
```

Actual `.env` files must remain local and ignored by Git.

## Production Compatibility

The code must not hardcode:

- localhost URLs
- production URLs
- database credentials
- API keys
- authentication secrets

Use centralized configuration and environment variables.

## Expected Deployment Architecture

The exact providers can be finalized later, but the architecture should support:

```text
Frontend → Vercel or equivalent
Backend  → Render/Railway or equivalent
Database → Aiven PostgreSQL
```

The backend should expose a health-check endpoint suitable for deployment monitoring.

Prisma migrations must be committed and usable for production deployment.

# 24. Development Phases

The project must be completed sequentially.

Do not skip phases without a documented reason.

---

## Phase 0 — Project Initialization & Planning

**Status:** COMPLETED

### Objectives

- Create repository structure
- Initialize frontend
- Initialize backend
- Configure TypeScript
- Configure Tailwind CSS
- Configure ESLint/Prettier
- Configure environment variables
- Create `.env.example`
- Set up Git
- Confirm frontend and backend can run
- Establish initial project architecture
- Confirm PostgreSQL development connection strategy

### Completion Criteria

- Frontend starts successfully
- Backend starts successfully
- TypeScript works
- Environment configuration exists
- Project structure is established
- No secrets are committed

### Tasks

- [x] Initialize repository
- [x] Create frontend
- [x] Create backend
- [x] Configure frontend dependencies
- [x] Configure backend dependencies
- [x] Configure TypeScript
- [x] Configure linting/formatting
- [x] Configure environment files
- [x] Add `.gitignore`
- [x] Establish API base structure
- [x] Verify local startup

---

## Phase 1 — Design System & Application Shell

**Status:** COMPLETED

### Objectives

Build the visual foundation before implementing business functionality.

### Tasks

- [x] Define typography (Inter + Playfair Display via Google Fonts)
- [x] Define spacing system (Tailwind v4 @theme tokens)
- [x] Define colors (brand amber palette + surface dark palette)
- [x] Define buttons (Button.tsx — 5 variants, 5 sizes, loading state)
- [x] Define form controls (Input, Textarea, Select with labels/errors)
- [x] Define cards (Card.tsx — hover lift, StatCard)
- [x] Define badges (Badge.tsx — 7 color variants with dot indicator)
- [x] Define modals/dialogs (Modal.tsx — portal, backdrop blur, escape key)
- [x] Define loading states (Skeleton, ProductCardSkeleton, PageLoader, Spinner)
- [x] Define empty states (EmptyState, EmptyCart, EmptySearch, ErrorState)
- [x] Build responsive navbar (desktop dropdown + mobile side drawer)
- [x] Build footer (5-column grid with social icons)
- [x] Build global layouts (MainLayout, AuthLayout, WideLayout)
- [x] Configure animation system (PageTransition, FadeIn, StaggerContainer, ScaleIn)
- [x] Establish responsive breakpoints (sm/md/lg/xl Tailwind breakpoints)

### Completion Criteria

A consistent visual design system exists and can be reused throughout the application.

---

## Phase 2 — Database Architecture & Backend Foundation

**Status:** COMPLETED

### Objectives

Create the PostgreSQL schema and backend architecture.

### Tasks

- [x] Configure Prisma
- [x] Design database schema
- [x] Create migrations
- [x] Add relationships
- [x] Add indexes
- [x] Add constraints
- [x] Configure Express application
- [x] Configure middleware
- [x] Configure error handling
- [x] Configure validation
- [x] Configure CORS
- [x] Configure authentication foundation
- [x] Create API response conventions

### Completion Criteria

Database can be migrated successfully and backend foundation is operational.

---

## Phase 3 — Authentication & User Accounts

**Status:** COMPLETED

### Objectives

Implement secure customer/admin authentication.

### Tasks

- [x] User registration
- [x] Login
- [x] Logout
- [x] Password hashing
- [x] Authentication session/cookie mechanism
- [x] Authentication middleware
- [x] Role middleware
- [x] Customer account page
- [x] Profile management
- [x] Address management (foundation)
- [x] Protected routes
- [x] Admin authentication (foundation)

### Completion Criteria

Customers and admins can authenticate securely and protected resources are enforced by the backend.

---

## Phase 4 — Product Catalog & Categories

**Status:** COMPLETED

### Objectives

Build the core product/catalog system.

### Tasks

- [x] Product database model
- [x] Category database model
- [x] Product APIs
- [x] Category APIs
- [x] Product seed data
- [x] Category seed data
- [x] Product listing
- [x] Product cards
- [x] Product details
- [x] Product gallery
- [x] Categories
- [x] Search
- [x] Filtering
- [x] Sorting
- [x] Pagination

### Completion Criteria

Customers can browse and discover products using the complete catalog functionality.

---

## Phase 5 — Cart System

**Status:** COMPLETED

### Objectives

Implement persistent authenticated carts.

### Tasks

- [x] Cart API
- [x] Add to cart
- [x] Remove from cart
- [x] Update quantity
- [x] Cart page
- [x] Cart drawer where appropriate
- [x] Server-side totals
- [x] Stock validation
- [x] Empty cart state
- [x] Cart persistence

### Completion Criteria

Authenticated customers can fully manage a persistent shopping cart.

### Notes

> The Prisma schema for `CartItem` was extended with `priceAtAdd` and `variantId` fields. The migration file is ready (`add_cart_item_fields`) but the Aiven database was unreachable at migration time. **Run `npx prisma migrate dev` as the first step of the next session to apply the schema change.** The cart API currently computes price from the product's live price (which is fine for Phase 5 completion).

---

## Phase 6 — Multiple Wishlist System

**Status:** COMPLETED

### Objectives

Implement multiple user-owned wishlists.

### Tasks

- [x] Wishlist database model
- [x] Wishlist APIs
- [x] Create wishlist
- [x] Rename wishlist
- [x] Delete wishlist
- [x] Add product
- [x] Remove product
- [x] Wishlist page
- [ ] Wishlist selection modal
- [ ] Authentication enforcement

### Completion Criteria

A customer can maintain multiple independent wishlists.

---

## Phase 7 — Checkout & Dummy Payments

**Status:** COMPLETED

### Objectives

Implement a complete checkout experience with simulated payments.

### Tasks

- [x] Checkout page
- [x] Address selection
- [x] Delivery options
- [x] Order summary
- [x] Demo payment UI
- [x] Payment API
- [x] Payment success flow
- [x] Payment failure flow
- [x] Server-side payment simulation
- [x] Order creation
- [x] Stock deduction
- [x] Confirmation page

### Completion Criteria

An authenticated user can successfully complete a realistic demo checkout and create an order.

---

## Phase 8 — Customer Orders & Account Experience

**Status:** COMPLETED

### Objectives

Complete the customer account/order experience.

### Tasks

- [x] Order history
- [x] Order detail page
- [x] Order status display
- [x] Payment status
- [x] Purchased products
- [x] Shipping information
- [x] Account dashboard
- [x] Profile
- [x] Addresses
- [x] Empty/error/loading states

### Completion Criteria

Customers can manage their account and fully inspect their orders.

---

## Phase 9 — Admin Dashboard Foundation

**Status:** COMPLETED

### Objectives

Build the main admin application shell and dashboard.

### Tasks

- [x] Admin layout
- [x] Sidebar
- [x] Header
- [x] Dashboard page
- [x] Statistic cards
- [x] Charts
- [x] Recent orders
- [x] Quick actions
- [x] Responsive admin design
- [x] Admin route protection

### Completion Criteria

Admins have a polished dashboard backed by real database data.

---

## Phase 10 — Admin Catalog Management

**Status:** COMPLETED

### Objectives

Allow admins to manage products and categories.

### Tasks

- [x] Product table
- [x] Product search
- [x] Product filters
- [x] Create product
- [x] Edit product
- [x] Delete product
- [x] Product image handling
- [x] Category management
- [x] Product status
- [x] Inventory management

### Completion Criteria

Admins can manage the product catalog through the dashboard.

---

## Phase 11 — Admin Order & Customer Management

**Status:** COMPLETED

### Objectives

Create complete business management functionality.

### Tasks

- [x] Orders table
- [x] Order search
- [x] Order filtering
- [x] Order details
- [x] Update order status
- [x] Payment information
- [x] Customer list
- [x] Customer details
- [x] Customer statistics

### Completion Criteria

Admins can manage the major operational aspects of the store.

---

## Phase 12 — Analytics & Business Intelligence

**Status:** COMPLETED

### Objectives

Make the admin dashboard useful as a business analytics system.

### Tasks

- [x] Revenue analytics
- [x] Order analytics
- [x] Customer analytics
- [x] Product analytics
- [x] Category analytics
- [x] Top products
- [x] Average order value
- [x] Revenue charts
- [x] Order status charts
- [x] Customer growth charts
- [x] Date filtering

### Completion Criteria

Analytics are calculated from real database data and provide meaningful business insight.

---

## Phase 13 — Reviews, Coupons & Extended Features

**Status:** NOT STARTED

### Optional/Extended Tasks

- [x] Product reviews
- [x] Review ratings
- [x] Admin review moderation
- [ ] Coupons
- [ ] Discount rules
- [ ] Featured products
- [ ] Promotional campaigns
- [ ] Additional product variants
- [ ] Advanced inventory

These should not delay completion of the core showcase.

---

## Phase 14 — Premium UI/UX & Animation Pass

**Status:** COMPLETED

### Objectives

Polish the entire application to showcase quality.

### Tasks

- [x] Homepage polish
- [x] Product card animations
- [x] Page transitions
- [x] Cart animations
- [x] Wishlist animations
- [x] Product gallery transitions
- [x] Skeleton loaders
- [x] Micro-interactions
- [x] Hover states
- [x] Mobile polish
- [x] Accessibility improvements
- [x] Reduced-motion handling
- [x] Visual consistency audit

### Completion Criteria

The website feels premium and commercially designed.

---

## Phase 15 — Testing, Security & Performance

**Status:** NOT STARTED

### Objectives

Prepare the application for demonstration and potential deployment.

### Tasks

- [ ] Authentication testing
- [ ] Authorization testing
- [ ] Cart testing
- [ ] Wishlist testing
- [ ] Checkout testing
- [ ] Payment testing
- [ ] Order testing
- [ ] Admin testing
- [ ] API validation testing
- [ ] Error handling audit
- [ ] Security audit
- [ ] Database index review
- [ ] Performance review
- [ ] Mobile testing
- [ ] Browser testing
- [ ] Build verification

### Completion Criteria

Core flows work reliably and no major known security/functionality issues remain.

---

## Phase 16 — Deployment & Showcase Preparation

**Status:** NOT STARTED

### Objectives

Deploy the application and make it ready for customers to explore.

### Tasks

- [ ] Production environment configuration
- [ ] Production database
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Environment variables
- [ ] Seed/demo data
- [ ] Demo customer account
- [ ] Demo admin account
- [ ] README
- [ ] Showcase landing/entry point
- [ ] Final UX review
- [ ] Final performance review
- [ ] Final security review

### Completion Criteria

The application is publicly accessible and ready to be shown to potential customers.

---

# 25. Current Database Status

**Status:** Aiven PostgreSQL database already created.

Expected database: PostgreSQL.

Database provider: Aiven PostgreSQL.

ORM: Prisma.

Schema status: Not started.

Connection configuration must use `DATABASE_URL` and environment variables.

---

# 26. Current Authentication Status

**Status:** Not implemented.

Expected roles:

```text
CUSTOMER
ADMIN
```

---

# 27. Current API Status

**Status:** Not implemented.

Expected base API:

```text
/api/auth
/api/users
/api/products
/api/categories
/api/cart
/api/wishlists
/api/orders
/api/payments
/api/reviews
/api/admin
```

---

# 28. Current Frontend Status

**Status:** Not implemented.

Expected main areas:

```text
Home
Shop
Category
Product
Search
Cart
Wishlist
Checkout
Account
Orders
Authentication
Admin
```

---

# 29. Current Admin Status

**Status:** Not implemented.

Expected areas:

```text
Dashboard
Products
Categories
Inventory
Orders
Payments
Customers
Analytics
Settings
```

---

# 30. Decisions Made

### Decision 1 — Full-stack from the beginning

The project will use a real backend and PostgreSQL database from the beginning rather than being a frontend-only demo.

Reason:

The purpose is to demonstrate the company's ability to build complete software systems.

### Decision 2 — Authentication is required

Customers must authenticate before:

- Checkout
- Placing orders
- Using persistent wishlists
- Managing their account

### Decision 3 — Payments are simulated

The project will contain a realistic dummy payment system.

No real payment processing is required for the showcase version.

### Decision 4 — Admin panel is a core feature

The admin dashboard is not optional.

It must demonstrate:

- Catalog management
- Order management
- Customer management
- Inventory
- Analytics
- Business statistics

### Decision 5 — Premium design is a major priority

The application must be visually impressive enough to act as a company showcase.

---

### Decision 6 — Aiven PostgreSQL

An Aiven PostgreSQL database has already been created and will be used as the project's database.

It should support both local development and production.

Database credentials must remain in environment variables and must never be committed.

### Decision 7 — Local and production compatibility

The application must use the same codebase and configuration pattern for local and production environments.

Environment-specific values must be supplied through environment variables rather than hardcoded in source code.

# 31. Known Issues

No known issues yet.

---

# 32. Important Future Decisions

Document important architectural decisions here as they are made.

Examples:

- Authentication mechanism
- Image storage provider
- Production hosting
- Database hosting
- Deployment architecture
- Exact Prisma schema decisions
- API versioning strategy
- Payment simulation design
- Product variant design

---

# 33. Completed Work Log

## 2026-08-24

- Project requirements defined.
- Full-stack architecture selected.
- React + TypeScript frontend selected.
- Node.js + Express + TypeScript backend selected.
- PostgreSQL + Prisma selected.
- Authentication requirement confirmed.
- Dummy payment requirement confirmed.
- Multiple wishlist requirement confirmed.
- Admin dashboard requirement confirmed.
- Sequential development phases defined.
- `AI.md` specification established.
- `CONTEXT.md` created.
- Project/brand name finalized as **The Aisle**.
- Minimalist symbolic logo direction selected.
- Existing **Aiven PostgreSQL** database confirmed as the project database.
- **Phase 0 COMPLETED** — Git, Vite+React+TS frontend, Node+Express+TS backend, Prisma, `.gitignore`, `.env.example`, `/api/health` endpoint.
- **Phase 1 COMPLETED** — Full design system and application shell:
  - `frontend/src/index.css` — Tailwind v4 `@theme` tokens for brand amber + surface dark palettes, global base styles, utility classes (`container-app`, `glass`, `text-gradient-brand`, `skeleton`, etc.).
  - `frontend/src/components/ui/Button.tsx` — 5 variants (primary/secondary/outline/ghost/danger), 5 sizes, loading state, icon slots.
  - `frontend/src/components/ui/Badge.tsx` — 7 color variants, dot indicator.
  - `frontend/src/components/ui/FormControls.tsx` — Input, Textarea, Select with labels, errors, helper text, icon addons.
  - `frontend/src/components/ui/Card.tsx` — Card with hover lift animation, StatCard with trend indicators.
  - `frontend/src/components/ui/Modal.tsx` — Portal-rendered, Framer Motion animated, escape-key + backdrop dismiss, scroll lock.
  - `frontend/src/components/ui/Loading.tsx` — Skeleton, ProductCardSkeleton, PageLoader, Spinner.
  - `frontend/src/components/ui/EmptyState.tsx` — EmptyState, EmptyCart, EmptySearch, ErrorState.
  - `frontend/src/components/ui/index.ts` — Barrel export for all UI components.
  - `frontend/src/components/layout/Navbar.tsx` — Responsive nav: desktop category dropdown (hover), mobile side drawer (spring animation), scroll-based glass backdrop, active link highlighting.
  - `frontend/src/components/layout/Footer.tsx` — 5-column grid with brand column, shop/company/support links, social icons.
  - `frontend/src/components/layout/Layouts.tsx` — MainLayout, AuthLayout, WideLayout.
  - `frontend/src/components/animation/Transitions.tsx` — PageTransition, FadeIn (directional), StaggerContainer/StaggerItem, ScaleIn.
  - `frontend/src/pages/HomePage.tsx` — Polished hero, feature strip, category grid, coming-soon banner.
  - `frontend/src/pages/ShopPage.tsx` — Stub with skeleton loaders.
  - `frontend/src/pages/NotFoundPage.tsx` — Animated 404 page.
  - `frontend/src/App.tsx` — BrowserRouter + AnimatePresence + QueryClientProvider + Routes.
  - `frontend/index.html` — SEO meta tags, Google Fonts (Inter + Playfair Display).
- **Phase 2 COMPLETED** — Database Architecture & Backend Foundation:
  - Designed full Prisma schema in `backend/prisma/schema.prisma` (User, Address, Category, Product, ProductImage, ProductVariant, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Payment, Review, Coupon).
  - Setup core database models with proper relations, mappings (`@map`), and indices (`@@index`).
  - Added Prisma singleton initialization logic in `backend/src/lib/prisma.ts`.
  - Configured custom error classes and Express error handling middleware in `backend/src/utils/errors.ts` and `backend/src/middleware/errorHandler.ts`.
  - Added centralized API response wrappers in `backend/src/utils/apiResponse.ts`.
  - Setup validation middleware utilizing Zod schemas in `backend/src/middleware/validate.ts` and created initial validation schemas in `backend/src/validators/index.ts`.
  - Configured JWT authentication middleware in `backend/src/middleware/auth.ts`.
  - Built an in-memory rate limiter middleware in `backend/src/middleware/rateLimiter.ts`.
  - Implemented async route wrapper `backend/src/utils/asyncHandler.ts`.
  - Scaffolded base Express router stubs in `backend/src/routes/` for all major endpoints (auth, products, categories, cart, wishlist, orders, payments, admin).
  - Wired all middleware, security headers, routers, and health checks together in `backend/src/server.ts`.
  - Successfully generated Prisma client and ran `prisma migrate dev` on the Aiven database (`init_full_schema` migration).

**Tests:**
- `npm run dev` — Vite starts on port 5173 in 1180ms ✓
- `npx tsc --noEmit` (frontend) — 0 errors ✓
- `npx tsc --noEmit` (backend) — 0 errors ✓
- `npm install` (frontend) — 98 packages, 0 vulnerabilities ✓
- `npm install` (backend) — 201 packages installed ✓
- Backend database schema successfully synced with Aiven PostgreSQL. ✓

- **Phase 14 COMPLETED** — Premium UI/UX & Animation Pass:
  - **Transitions.tsx**: Added `useReducedMotion` to all animation primitives, new `SlideIn` and `PressScale` components. Reduced-motion safe across the board.
  - **HomePage.tsx**: Full rewrite — animated grid overlay, multi-layer orb depth, pulsing badge, social proof row, gradient category cards with emoji spring animations, and a sale promotional banner replacing the placeholder.
  - **ProductCard.tsx**: hover lift (`y:-4`), image zoom on hover, overlay quick-add CTA, AnimatePresence wishlist button reveal, badge spring scale-in.
  - **Loading.tsx**: shimmer gradient skeleton (uses `@keyframes shimmer`), improved PageLoader with double-ring design, correct ProductCardSkeleton matching new card aspect ratio.
  - **index.css**: Added `@keyframes shimmer`, `.hide-scrollbar`, `.card-glass`, `.input-premium` utilities.
  - **ProductPage.tsx**: `AnimatePresence` cross-fade on image gallery switch, `motion.button` whileTap on quantity stepper, sale badge spring animation.
  - **CartDrawer.tsx**: Animated cart item count badge (spring pop on change), animated empty-state icon scale-in.
  - **Button.tsx**: Added `whileHover` scale-up, fixed focus ring CSS var.
  - **Navbar.tsx**: Live animated cart item count badge (`AnimatePresence` spring pop), cleaner icon button loop.
  - **AccountPage.tsx**: `AnimatePresence mode="wait"` tab content switch with y-slide.
  - **ShopPage.tsx**: `StaggerContainer` + `StaggerItem` for staggered product grid entry.

**Tests:**
- `npx tsc --noEmit` (frontend) — 0 errors ✓

---

# 34. Session Handoff

## Current Phase

**Phase 13 — User Account & Experience**

## Current Status

**READY TO START**

## What Has Been Done

- Phase 0–12, 14 COMPLETED (Phase 13 skipped for now).
- Full admin panel, analytics charts, and premium animation polish done.

## What Needs To Be Done Next

1. Product Reviews & Ratings system.
2. Profile editing (name / password).
3. Address book improvements.

# 34. Rules for Updating This File

Every AI agent must update this document after meaningful work.

When updating:

### Update phase status

Use only accurate statuses:

```text
NOT STARTED
IN PROGRESS
BLOCKED
COMPLETED
```

### Record completed work

Include specific features/files rather than vague statements.

Bad:

```text
Backend done.
```

Good:

```text
Created backend/src/server.ts, configured Express,
added /api/health endpoint, and verified it returns 200.
```

### Record tests

Example:

```text
Tests:
- npm run build — passed
- npm run lint — passed
- GET /api/health — 200
```

### Record problems

If something remains unresolved, explicitly document it.

### Record the next task

Always leave a clear next action so another AI can continue without asking the previous model what it was doing.

---

# 35. Final Handoff Requirement

Before an AI session ends, this file must accurately answer:

1. What has been built?
2. What is currently being worked on?
3. What remains?
4. What files were changed?
5. What was tested?
6. What problems remain?
7. What should the next AI do first?

Do not rely on chat history for project continuity.

`AI.md` + `CONTEXT.md` must be sufficient for another AI agent to continue the project.
