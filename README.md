# 🚀 GadgetZone — MVP Gadget E-Commerce Platform (Bangladesh)

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-indigo.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-black.svg)](https://render.com/)

GadgetZone is a modern, production-quality MVP gadget e-commerce web application specifically built for the **Bangladesh** electronics market. It features prices formatted in **Bangladeshi Taka (BDT ৳)**, genuine warranty badges, express delivery nationwide, an extensible payment gateway architecture featuring **bKash (Sandbox/Live Tokenized Checkout)** and **Cash on Delivery (COD)**, and strict **Role-Based Access Control (RBAC)** across three distinct user roles.

---

## 📑 Table of Contents

- [1. User Roles & RBAC Matrix](#1-user-roles--rbac-matrix)
- [2. Core Features](#2-core-features)
- [3. Technology Stack & Architectural Decisions](#3-technology-stack--architectural-decisions)
- [4. Architecture Overview](#4-architecture-overview)
- [5. Git Branching Strategy](#5-git-branching-strategy)
- [6. Local Development Setup](#6-local-development-setup)
- [7. Environment Variables (.env.example)](#7-environment-variables-envexample)
- [8. Database & Migrations](#8-database--migrations)
- [9. Payment Gateway (bKash & COD)](#9-payment-gateway-bkash--cod)
- [10. Image Storage Strategy](#10-image-storage-strategy)
- [11. Testing & Build Verification](#11-testing--build-verification)
- [12. Render Deployment Guide](#12-render-deployment-guide)
- [13. Default Demo Accounts](#13-default-demo-accounts)
- [14. Known Limitations & Roadmap](#14-known-limitations--roadmap)

---

## 1. User Roles & RBAC Matrix

The system strictly enforces permissions on the backend API layer using JWT authentication and role-guard middleware. The frontend route protection provides a clean user experience, but authorization is authoritatively enforced by the server.

| Capability / Action | Guest (Unauthenticated) | Customer (Authenticated) | Admin (Elevated Privileges) |
| :--- | :---: | :---: | :---: |
| Browse Gadgets & Filter Categories | ✅ | ✅ | ✅ |
| Search Products by Name/Model | ✅ | ✅ | ✅ |
| View Product Details & Stock Status | ✅ | ✅ | ✅ |
| Add Items to Cart | ✅ | ✅ | ✅ |
| **Guest Checkout (Without Registering)** | ✅ | ✅ | ✅ |
| Track Any Order by Order Number | ✅ | ✅ | ✅ |
| User Registration & Profile Management | ❌ | ✅ | ✅ |
| Persistent Order History & Order Details | ❌ | ✅ (Own orders only) | ✅ (All platform orders) |
| Admin Operations Dashboard | ❌ | ❌ | ✅ |
| Create / Edit / Deactivate Products | ❌ | ❌ | ✅ |
| Upload & Manage Product Images | ❌ | ❌ | ✅ |
| Create / Edit Product Categories | ❌ | ❌ | ✅ |
| Update Order Fulfillment Status | ❌ | ❌ | ✅ |
| View Customer Account List | ❌ | ❌ | ✅ |

### Guest Checkout Guarantee
Guests are **never** forced to create an account or log in to complete a purchase. The order entity records guest contact information (`guestName`, `guestEmail`, `guestPhone`) when placed without authentication.

---

## 2. Core Features

- **Store Branding:** GadgetZone Bangladesh — "Your Ultimate Gadget Destination".
- **Product Categories:** Smartphones, Earbuds, Smartwatches, Power Banks.
- **BDT Currency:** Formatted as `৳49,999` with Bangladesh localized number formatting.
- **Guest Checkout Flow:** Product → Cart → Checkout Details → bKash / COD Selection → Instant Order Confirmation with live Order Reference (`GZ-YYYYMMDD-XXXXXX`).
- **Live Order Tracking:** Public order tracking by reference number with visual stepper: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`.
- **Customer Portal:** Dedicated dashboard, profile address manager, and personal order history.
- **Admin Command Center:**
  - Revenue, order volume, catalog size, and user count metrics.
  - Product catalog CRUD with image upload and stock management.
  - Order status manager with delivery lifecycle transitions.
  - Category manager and customer directory.

---

## 3. Technology Stack & Architectural Decisions

### Frontend
- **React 19 & Vite 8:** Blazing-fast development server, optimized ESM bundling, zero overhead.
- **Tailwind CSS v4:** Modern CSS engine with clean design tokens, custom utility classes, and responsive mobile-first grids.
- **React Router Dom v7:** Declarative client-side routing with nested protected routes (`ProtectedRoute` and `AdminRoute`).
- **Zustand:** Lightweight, performant state management for persistent shopping cart (`cartStore.js`) and user session (`authStore.js`).
- **Axios:** Centralized API client with request/response interceptors for automatic Bearer token injection and 401 session expiration handling.
- **Lucide Icons & React Hot Toast:** Polished iconography and responsive notifications.

### Backend
- **Node.js & Express.js:** Mature, high-throughput REST API layer.
- **Prisma ORM (v6):** Strongly-typed data access layer with robust migrations and relational schema modeling.
- **PostgreSQL:** ACID-compliant relational database perfectly suited for e-commerce transactions, orders, payments, and inventory.
- **JWT (JSON Web Tokens) & BcryptJS:** Stateless access tokens (15m expiry) and refresh tokens (7d expiry) paired with salted password hashing (work factor 12).
- **Helmet, CORS, Morgan, & Express-Rate-Limit:** Multi-layered defensive security against brute-force attacks, XSS, and CORS violations.
- **Multer & Cloudinary:** Dual-mode image storage with automatic fallback to local disk uploads.

---

## 4. Architecture Overview

```
Gadget website/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Data models: User, Product, Category, Order, Payment
│   │   └── seed.js               # Database seeder with 14+ BD gadget products
│   ├── src/
│   │   ├── config/               # Prisma client & Cloudinary configurations
│   │   ├── controllers/          # Business logic (Auth, Product, Category, Order, Payment, Admin)
│   │   ├── middleware/           # Auth (JWT verification & RBAC), Upload (Multer), Validation
│   │   ├── routes/               # Modular Express routers
│   │   ├── utils/                # JWT helpers, order number generator, slugifier, BDT formatter
│   │   ├── validators/           # Express-validator schemas
│   │   └── server.js             # Express app setup, rate-limiting, error handling
│   ├── tests/                    # Vitest integration & unit tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # Centralized Axios instance with interceptors
│   │   ├── components/           # Modular UI: layout, products, cart, common, auth guards
│   │   ├── pages/                # Public, Customer, and Admin view controllers
│   │   ├── stores/               # Zustand stores (authStore, cartStore)
│   │   ├── App.jsx               # Route definitions
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # Tailwind CSS v4 directives
│   ├── vite.config.js
│   └── package.json
├── render.yaml                   # Infrastructure as Code blueprint for Render
├── .env.example                  # Environment configuration template
├── .gitignore                    # Secrets & artifact exclusions
└── README.md
```

---

## 5. Git Branching Strategy

The repository follows a clean multi-branch workflow:
- **`main`**: Production-ready, verified, stable code.
- **`dev`**: Active integration branch for feature convergence.
- **`backend`**: Dedicated backend API development and test branch.
- **`frontend`**: Dedicated frontend UI, components, and client-state branch.

---

## 6. Local Development Setup

### Prerequisites
- Node.js v20+ and npm v10+
- PostgreSQL database instance (local or hosted, such as Render / Supabase / Neon)
- Git

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<your-username>/gadgetzone-ecommerce.git
cd gadgetzone-ecommerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` in the root folder to `.env` and fill in your database credentials:

```bash
cp .env.example .env
```

### 3. Initialize Database & Seed Products

```bash
cd backend
# Generate Prisma Client
npx prisma generate

# Push Schema to PostgreSQL Database
npx prisma db push

# Seed Admin, Demo Customer, Categories & 14+ Gadgets
npm run prisma:seed
```

### 4. Run Development Servers

In terminal 1 (Backend API):
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
cd frontend
npm run dev
# UI accessible at http://localhost:5173
```

---

## 7. Environment Variables (.env.example)

```env
# ----- Server -----
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# ----- Database (PostgreSQL) -----
DATABASE_URL=postgresql://user:password@localhost:5432/gadgetzone?schema=public

# ----- JWT Authentication -----
JWT_SECRET=super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=refresh-token-secret-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ----- Admin Seed -----
ADMIN_EMAIL=admin@gadgetzone.com
ADMIN_PASSWORD=Admin@123456

# ----- bKash Payment Gateway (Sandbox) -----
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

# ----- Cloudinary (Image Storage) -----
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ----- Rate Limiting -----
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

---

## 8. Database & Migrations

The database schema is fully normalized and managed via Prisma ORM:
- **`users`**: Email (unique), hashed password, name, phone, address, role (`CUSTOMER`, `ADMIN`).
- **`categories`**: Name, slug, description, image, active toggle.
- **`products`**: Name, slug, description, price, comparePrice, SKU, stock quantity, active & featured flags.
- **`product_images`**: Multi-image gallery with primary thumbnail indicator.
- **`orders`**: Unique order number, optional user ID (guest checkout support), shipping address, city, subtotal, shipping fee, total, status enum (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **`order_items`**: Line items linked to orders and products with historical price snapshotting.
- **`payments`**: Payment method (`BKASH`, `COD`), status (`PENDING`, `COMPLETED`, `FAILED`), transaction IDs.

---

## 9. Payment Gateway (bKash & COD)

### bKash Integration
- Built against the official **bKash Tokenized Checkout API v1.2.0-beta**.
- When `BKASH_APP_KEY` and `BKASH_APP_SECRET` are provided, real token granting and gateway URL redirection occurs.
- If credentials are not present during review/testing, the built-in **Sandbox Payment Simulator** activates, allowing demonstration orders to simulate successful bKash transaction confirmation (`TRX-XXXXXXXX`) seamlessly.

### Cash on Delivery (COD)
- Orders placed via COD are instantly confirmed and scheduled for dispatch, with payment status marked as `PENDING` until physical delivery.

---

## 10. Image Storage Strategy

1. **Cloudinary (Production Cloud Storage):** When Cloudinary environment variables are configured, product image uploads are automatically routed to Cloudinary with 800x800 auto-optimization.
2. **Local Disk Storage (Fallback):** If Cloudinary is not configured, images are safely saved to `backend/uploads/` and served statically via `/uploads/*`.

---

## 11. Testing & Build Verification

The application includes automated integration and unit test suites running on **Vitest** and **Supertest**:

```bash
# Run backend tests
cd backend
npm test

# Verify frontend production bundle
cd ../frontend
npm run build
```

---

## 12. Render Deployment Guide

The repository includes a ready-to-deploy `render.yaml` blueprint.

### Option A: One-Click Blueprint Deployment
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` and automatically provision:
   - `gadgetzone-db`: Managed PostgreSQL database.
   - `gadgetzone-api`: Express API web service with health checking at `/api/health`.
   - `gadgetzone-ui`: Static React site with SPA rewrites (`/* -> /index.html`).
5. Click **Apply**.

### Option B: Manual Service Creation
- **Database:** Create a PostgreSQL instance named `gadgetzone-db`.
- **Backend:** Create a Web Service:
  - Root Directory: `backend`
  - Build Command: `npm install && npx prisma generate`
  - Start Command: `npm start`
  - Add Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=5000`.
- **Frontend:** Create a Static Site:
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
  - Rewrite Rule: `/*` → `/index.html`
  - Environment Variable: `VITE_API_URL=https://<your-backend-service>.onrender.com/api`.

---

## 13. Default Demo Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gadgetzone.com` | `Admin@123456` | Full platform dashboard, products, categories, orders |
| **Customer** | `customer@example.com` | `Customer@123` | Customer dashboard, order history, profile address |
| **Guest** | *No login needed* | *N/A* | Public catalog, guest cart, guest checkout |

---

## 14. Known Limitations & Roadmap

### Current MVP Scope
- Product reviews UI is read-only in this demo version.
- bKash payment gateway uses sandbox simulation when live merchant credentials are not configured.
- Free-tier Render web services spin down after 15 minutes of inactivity (cold start takes ~45 seconds).

### Recommended Next Features for v2.0
- SMS order notifications via Bangladesh SMS gateways (e.g., SSL Wireless / Greenweb).
- Nagad and Rocket mobile banking gateways alongside bKash.
- Automated coupon codes and promotional flash sales.
- Customer product review submission and star ratings.
- Automated email receipts via Resend or SendGrid.
