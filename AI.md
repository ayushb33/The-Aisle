# AI.md

## Project: The Aisle — Premium Full-Stack E-Commerce Showcase

This document contains the permanent instructions, architecture guidelines, development standards, and design principles for AI agents working on this project.

**Important:** `CONTEXT.md` is the living project state. Always read `AI.md` and `CONTEXT.md` before making changes.

---

# 1. Project Purpose

This project is **The Aisle**, a premium, production-style e-commerce showcase platform developed by our software company.

It will be publicly demonstrated to potential customers through the company's website to showcase our ability to build:

- Modern e-commerce storefronts
- Full-stack web applications
- Authentication systems
- Product/catalog management
- Shopping carts
- Multiple wishlists
- Checkout and payment workflows
- Order management
- Inventory management
- Admin dashboards
- Business analytics
- Responsive and animated UI
- REST APIs
- PostgreSQL-backed applications

This is not intended to look like a generic student/MERN project.

The final product should look and feel like a commercially developed e-commerce platform.

---

# 2. Primary Objectives

The application must prioritize:

1. Premium visual design
2. Excellent UX
3. Responsive design
4. Smooth animations
5. Complete core e-commerce functionality
6. Secure authentication and authorization
7. Proper backend architecture
8. Well-designed PostgreSQL database
9. Modern admin dashboard
10. Maintainable and scalable code
11. Realistic dummy/demo payment functionality
12. Production-quality engineering practices

The application should be impressive even before a visitor interacts with it.

---

# 3. Technology Stack

Use the following stack unless there is a strong technical reason to change it.

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
- Prisma ORM
- Zod for validation

## Database

- PostgreSQL
- **Aiven PostgreSQL is the primary project database**
- The same PostgreSQL-compatible architecture must work locally and in production
- Do not introduce a second database technology unless explicitly approved

## Environment and Deployment

The application must be designed to work in both:

- Local development
- Production deployment

Local and production environments must use environment variables for configuration.

The codebase must not contain environment-specific hardcoded URLs, credentials, ports, database connection strings, API keys, or secrets.

Expected deployment architecture:

```text
Frontend → Vercel (or equivalent production frontend host)
Backend  → Render/Railway/or equivalent Node hosting
Database → Aiven PostgreSQL
```

The exact production hosting provider may be selected later, but the application must remain portable.

Use separate environment configuration for local and production.

Never commit `.env` files or secrets.

Maintain `.env.example` files documenting required variables.

## Authentication

Use secure server-side authentication.

Preferred approach:

- HTTP-only authentication cookies/session strategy
- Secure password hashing using Argon2 or bcrypt
- Role-based authorization

Do not store sensitive authentication credentials in localStorage.

## Development Tools

- Git
- GitHub
- ESLint
- Prettier
- npm

---

# 4. High-Level Architecture

Use a clear separation between frontend, backend, and database.

```text
Frontend
   |
   | HTTP/REST API
   v
Backend API
   |
   | Prisma
   v
PostgreSQL
```

The frontend must not directly communicate with PostgreSQL.

All business-critical operations must go through the backend.

---

# 5. Repository Structure

Preferred structure:

```text
ecommerce-platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── lib/
│   │   ├── types/
│   │   └── assets/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   └── ...
│
├── AI.md
├── CONTEXT.md
└── README.md
```

Do not create unnecessary folders or over-engineer the structure.

---

# 6. Core Customer Features

The customer application should eventually support:

## Storefront

- Premium homepage
- Product discovery
- Featured products
- New arrivals
- Best sellers
- Promotional sections
- Product categories
- Responsive navigation
- Responsive footer

## Product Discovery

- Product listing
- Category browsing
- Search
- Search suggestions
- Price filtering
- Category filtering
- Brand filtering where applicable
- Rating filtering
- Availability filtering
- Sorting

## Product Details

- Product gallery
- Multiple images
- Product description
- Specifications
- Price
- Discount
- Stock
- Rating
- Reviews
- Variants
- Quantity selection
- Add to cart
- Buy now
- Wishlist

## Cart

- Add product
- Remove product
- Update quantity
- Calculate subtotal
- Shipping calculation/display
- Total
- Coupon support when implemented
- Save for later where implemented

## Wishlist

Users must be able to:

- Create multiple wishlists
- Rename wishlists
- Delete wishlists
- Add products to a specific wishlist
- Remove products
- View wishlist products

Example:

```text
Favorites
Birthday Ideas
Future Purchases
Home Setup
```

## Authentication

Users should be able to:

- Register
- Login
- Logout
- View profile
- Update profile
- Manage addresses
- View orders

Certain actions require authentication:

- Wishlist
- Checkout
- Place order
- Order history
- Account management

## Checkout

The checkout should contain:

1. Cart review
2. Shipping address
3. Delivery method
4. Payment
5. Order confirmation

Payment is currently a **dummy/demo payment system**.

No real money should be processed.

## Orders

Customers should be able to:

- Place orders
- View order history
- View order details
- See payment status
- See order status
- See purchased products
- See shipping address

---

# 7. Dummy Payment System

The payment system is intentionally simulated.

It must behave realistically without processing actual payments.

Example flow:

```text
Checkout
   ↓
Payment Details
   ↓
Processing Payment
   ↓
Payment Successful
   ↓
Create Order
   ↓
Order Confirmation
```

Store payment information in the database.

Example fields:

```text
payment_status
payment_method
transaction_id
amount
currency
created_at
```

Use clearly identifiable demo transaction IDs.

Never connect real payment credentials unless explicitly requested later.

---

# 8. Admin Panel

The admin panel is a major part of the showcase.

Use a modern dashboard design.

Expected sections:

```text
Dashboard

Catalog
├── Products
├── Categories
└── Inventory

Sales
├── Orders
└── Payments

Customers
├── Customers
├── Reviews
└── Wishlists

Analytics
├── Sales Analytics
├── Product Analytics
└── Customer Analytics

System
├── Admin Users
└── Settings
```

Not every advanced section must be completed in the initial version, but the core admin functionality must work.

---

# 9. Admin Dashboard

Dashboard should provide meaningful statistics such as:

- Total revenue
- Revenue today
- Revenue this month
- Total orders
- Pending orders
- Completed orders
- Cancelled orders
- Total customers
- New customers
- Total products
- Low-stock products
- Average order value

Charts should include useful information such as:

- Revenue over time
- Orders over time
- Sales by category
- Top-selling products
- Customer growth
- Order status distribution

Do not create meaningless decorative statistics.

Statistics should come from actual database data where possible.

---

# 10. Admin Product Management

Admin must eventually be able to:

- Create products
- Edit products
- Delete products
- Enable/disable products
- Set price
- Set discount
- Set stock
- Assign category
- Add product images
- Add variants
- Add specifications
- Mark featured
- Mark new arrival

Validate all product data on the backend.

Never trust frontend validation alone.

---

# 11. Admin Category Management

Admin should be able to:

- Create categories
- Edit categories
- Delete categories
- Enable/disable categories
- View products belonging to categories

Prevent destructive operations that would leave invalid product references.

---

# 12. Admin Order Management

Admin should be able to:

- View orders
- Search orders
- Filter orders
- View order details
- View customer information
- View payment information
- Change order status

Typical order statuses:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

Use a consistent state transition model.

---

# 13. Database Guidelines

Use PostgreSQL with Prisma.

The project already has an **Aiven PostgreSQL database**. Use that database as the project's database for local development and production unless explicitly changed later.

Core entities are expected to include:

```text
User
Admin/Role
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

Exact schema decisions should be documented in `CONTEXT.md` when finalized.

Use:

- Foreign keys
- Appropriate indexes
- Unique constraints
- Cascading rules where appropriate
- Timestamps
- Proper nullable/non-nullable decisions

Do not duplicate data unnecessarily.

---

# 14. Authentication and Authorization

There must be a clear distinction between:

```text
CUSTOMER
ADMIN
```

Backend authorization must verify the authenticated user's role.

Never rely on frontend route protection alone.

For example:

```text
GET /api/admin/orders
```

must verify:

1. User is authenticated
2. User has ADMIN privileges

A user should never be able to access admin APIs merely by manually entering an admin URL.

---

# 15. API Guidelines

Use RESTful APIs.

Example:

```text
/api/auth
/api/products
/api/categories
/api/cart
/api/wishlists
/api/orders
/api/payments
/api/users
/api/admin
```

Use appropriate HTTP methods:

```text
GET
POST
PATCH
PUT
DELETE
```

Use consistent API responses.

Example:

```json
{
  "success": true,
  "data": {}
}
```

For errors:

```json
{
  "success": false,
  "message": "Product not found"
}
```

Do not expose stack traces or sensitive internal information to clients.

---

# 16. Validation

Validate input at the backend.

Use Zod or equivalent validation.

Validate:

- Email
- Password
- Product IDs
- Quantities
- Prices where applicable
- Addresses
- Order data
- Wishlist IDs
- Category IDs
- Admin inputs

Never trust values such as price or total sent by the frontend.

Order totals must be calculated server-side.

---

# 17. Security Requirements

Security is important even though this is a showcase project.

Implement:

- Password hashing
- HTTP-only cookies where applicable
- Authentication middleware
- Authorization middleware
- Input validation
- Rate limiting where appropriate
- CORS configuration
- Secure headers
- Environment variables
- No hardcoded secrets
- Proper error handling
- Server-side price calculation

Never commit:

```text
.env
database credentials
API keys
JWT secrets
passwords
private tokens
```

Provide `.env.example` instead.

---

# 18. UI/UX Design Direction

The website should look **premium, modern, sophisticated and commercial**.

Avoid:

- Generic Bootstrap appearance
- Excessive gradients
- Random animations
- Cluttered layouts
- Excessive rounded cards
- Poor typography
- Inconsistent spacing
- Default browser controls
- Template-like appearance

Prioritize:

- Strong typography
- Excellent spacing
- Visual hierarchy
- High-quality imagery
- Clean product cards
- Elegant navigation
- Strong CTA design
- Subtle micro-interactions
- Smooth transitions
- Consistent design system

The design should be impressive without becoming difficult to use.

---

# 19. Animation Guidelines

Use Framer Motion where appropriate.

Animations should improve UX rather than exist purely for decoration.

Good examples:

- Page transitions
- Product card hover
- Image transitions
- Add-to-cart animation
- Wishlist animation
- Modal transitions
- Filter drawer transitions
- Scroll reveals
- Loading transitions
- Cart updates

Avoid excessive animation that causes:

- Slow interaction
- Visual clutter
- Accessibility problems
- Poor mobile performance

Respect reduced-motion preferences where possible.

---

# 20. Responsive Design

The application must work properly on:

- Mobile
- Tablet
- Laptop
- Desktop
- Large desktop screens

Do not simply shrink the desktop layout.

Design mobile experiences intentionally.

Important mobile considerations:

- Mobile navigation
- Bottom sheets
- Filter drawer
- Touch-friendly buttons
- Two-column product grid where appropriate
- Sticky checkout actions
- Readable typography
- Proper image sizing

---

# 21. Performance

Prioritize:

- Lazy loading
- Optimized images
- Efficient API requests
- Query caching
- Pagination
- Database indexes
- Avoiding unnecessary renders
- Proper component splitting

Do not load hundreds of products at once if pagination can be used.

---

# 22. Error and Loading States

Every major asynchronous operation should have:

- Loading state
- Success state
- Error state
- Empty state

Examples:

```text
Loading products...
No products found
Unable to load products
Product added successfully
Payment failed
Cart is empty
No orders found
```

Avoid blank screens.

Use skeleton loaders where appropriate.

---

# 23. Code Quality

Write clean, maintainable TypeScript.

Prefer:

- Small reusable components
- Clear naming
- Strong typing
- Reusable hooks
- Reusable services
- Centralized API handling
- Consistent error handling

Avoid:

- Giant components
- Repeated code
- `any` unless genuinely necessary
- Hardcoded business logic throughout UI
- Unnecessary abstraction
- Premature optimization

---

# 24. Git Guidelines

Make logical commits.

Examples:

```text
feat: add product catalog
feat: implement authentication
feat: add shopping cart
feat: implement wishlist system
feat: add checkout flow
feat: add admin dashboard
fix: resolve cart quantity issue
fix: validate order totals server-side
refactor: improve product service
```

Do not make meaningless commits such as:

```text
update
changes
final
final2
test
```

---

# 25. Environment Configuration

Use environment variables.

Frontend examples:

```text
VITE_API_URL
```

Backend examples:

```text
DATABASE_URL
PORT
SESSION_SECRET
CORS_ORIGIN
```

Never hardcode environment-specific values.

Maintain:

```text
.env.example
```

with placeholder values.

---

# 26. Testing

Test important business logic.

At minimum verify:

### Authentication

- Registration
- Login
- Logout
- Invalid credentials
- Protected routes

### Cart

- Add product
- Update quantity
- Remove product
- Empty cart

### Wishlist

- Create wishlist
- Add product
- Remove product
- Multiple wishlists

### Orders

- Checkout
- Payment success
- Payment failure
- Order creation
- Order history

### Admin

- Admin authentication
- Product CRUD
- Category CRUD
- Order management
- Unauthorized access prevention

---

# 27. Demo Data

The project should contain realistic seed data.

Do not use:

```text
Product 1
Product 2
Product 3
Test User
ABC Category
```

Use believable products, descriptions, categories and customers.

The application should look populated immediately after setup.

Use fictional brands/products where necessary to avoid trademark or licensing issues.

---

# 28. Demo Accounts

Create seed/demo accounts for development.

Example:

```text
Customer:
demo@example.com

Admin:
admin@example.com
```

Never use real passwords or credentials.

Document development credentials safely in the local development documentation, not in public production documentation.

---

# 29. Business Logic Rules

Important business rules must be enforced by the backend.

Examples:

- Cannot order unavailable products
- Cannot order quantity greater than stock
- Product price must come from the database
- Order totals must be calculated server-side
- Only authenticated users can place orders
- Only admins can manage catalog/order data
- Users can only access their own orders
- Users can only modify their own cart/wishlists
- Deleted/inactive products should not be purchasable
- Invalid categories cannot be assigned to products

---

# 30. Local & Production Compatibility

The application must be developed so that the same codebase can run locally and in production.

## Local Development

Local development should support:

```text
Frontend → localhost
Backend  → localhost
Database → Aiven PostgreSQL
```

The developer may use the Aiven PostgreSQL instance directly for local development.

Database credentials and connection settings must come exclusively from environment variables.

The application must not assume that PostgreSQL is running locally.

## Production

Production should support:

```text
Frontend → production frontend host
Backend  → production Node.js host
Database → Aiven PostgreSQL
```

Use environment variables for:

- Database connection
- Backend URL
- Frontend URL
- CORS origin
- Authentication/session secrets
- Any future third-party service credentials

## URL Handling

Never hardcode:

```text
http://localhost:...
https://production-domain...
```

inside application logic.

Use configuration/environment variables and centralized configuration modules.

## CORS

CORS must support the configured frontend origin(s) and must not use an unsafe wildcard configuration in production when credentials are involved.

## Database Migrations

Prisma migrations must be committed to Git.

Use appropriate commands for:

- Local development
- Production deployment

Do not manually modify production schema without documenting the change.

## Production Build

Before considering a phase complete, verify the relevant production build where practical.

At minimum, the project should be capable of:

```text
Frontend build
Backend TypeScript/build
Prisma client generation
Database migration/deployment
```

## Deployment Documentation

When deployment is implemented, document:

- Required environment variables
- Frontend deployment configuration
- Backend deployment configuration
- Aiven PostgreSQL configuration
- Migration/deployment procedure
- Seed/demo-data procedure
- Health-check endpoint
- Production troubleshooting notes

# 31. AI Agent Workflow

Every AI agent working on the project must follow this sequence.

### Step 1

Read:

```text
AI.md
CONTEXT.md
```

### Step 2

Determine:

- Current phase
- Completed work
- Current task
- Known issues
- Next required task

### Step 3

Inspect the existing code before modifying it.

Do not assume that something does not exist.

### Step 4

Implement only the work required for the current phase/task unless a dependency requires additional work.

### Step 5

Test the implementation.

At minimum:

- Run the relevant development/build commands
- Check for TypeScript errors
- Check for lint errors where configured
- Verify affected functionality

### Step 6

Update `CONTEXT.md`.

The update must record:

- What was completed
- Files/components created or changed
- Tests performed
- Problems encountered
- Decisions made
- Current status
- Exact next steps

### Step 7

Do not mark incomplete work as complete.

---

# 32. CONTEXT.md Is the Source of Project Progress

`CONTEXT.md` is a living document.

It exists specifically so another AI agent can continue the project if the current AI session/account/token limit ends.

Whenever meaningful work is completed, update it.

A new AI agent should be able to read:

```text
AI.md
CONTEXT.md
```

and immediately understand:

```text
What the project is
What has already been built
What is currently being worked on
What remains
What problems exist
What should be done next
```

Do not erase historical progress unless it is obsolete or incorrect.

---

# 33. Phase Discipline

The project is divided into sequential phases in `CONTEXT.md`.

Do not jump randomly between phases.

General rule:

```text
Phase N
   ↓
Complete
   ↓
Test
   ↓
Update CONTEXT.md
   ↓
Move to Phase N+1
```

If a later phase requires a missing dependency from an earlier phase, return to the earlier phase and fix it properly.

Do not create temporary hacks merely to skip a phase.

---

# 34. Handling Existing Code

Before changing existing code:

1. Inspect it.
2. Understand its purpose.
3. Check its dependencies.
4. Preserve working functionality.
5. Make the smallest clean change necessary.

Do not rewrite working parts of the project without a reason.

If a rewrite is necessary, document the reason in `CONTEXT.md`.

---

# 35. Handling Errors

When an error occurs:

1. Identify the root cause.
2. Fix the root cause.
3. Re-test.
4. Do not hide the error with arbitrary fallback logic.
5. Document significant unresolved problems in `CONTEXT.md`.

Never claim a feature works if it has not been tested.

---

# 36. No Fake Completion

The AI must never say:

```text
Implemented
```

unless the implementation actually exists.

Likewise, never mark a phase:

```text
COMPLETED
```

if important requirements remain unfinished.

Use:

```text
IN PROGRESS
BLOCKED
COMPLETED
```

accurately.

---

# 37. Important Principle

The final application should demonstrate that the company can build **real-world software**, not merely a visually attractive demo.

Therefore every major feature should balance:

```text
Design
+
UX
+
Functionality
+
Architecture
+
Security
+
Maintainability
```

The frontend should impress the customer.

The backend should demonstrate engineering capability.

The admin panel should demonstrate business-system capability.

The database should demonstrate proper data modeling.

The complete application should feel like a real product.

---

# 38. Final Rule

Before finishing any AI session, always:

1. Verify the current implementation.
2. Update `CONTEXT.md`.
3. Record incomplete work.
4. Record known issues.
5. Record the exact next task.
6. Leave the repository in a usable state.

The next AI agent must be able to continue from `CONTEXT.md` without relying on the previous conversation.
