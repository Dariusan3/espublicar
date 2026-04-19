# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**espublicar** is a C2C second-hand marketplace (like OLX/Wallapop) built with Next.js 15 (App Router) and React 19, using Appwrite as the backend-as-a-service. Users can list products for sale, browse/buy products, negotiate prices, message sellers, and manage orders through a dashboard.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Routing

Next.js App Router with grouped route segments:
- `app/(homes)/` - Homepage variants
- `app/(shop)/` - Shop listing pages (shop-default, shop-fullwidth, shop-right-sidebar)
- `app/(products)/` - Cart, checkout, wishlist, compare
- `app/(dashboard)/` - User account pages (my-account-*, offers, notifications)
- `app/(blogs)/` - Blog pages
- `app/(other-pages)/` - Static pages (about, contact, FAQ, etc.)
- `app/product/[id]/` - Dynamic product detail with image gallery
- `app/seller/[id]/` - Public seller profile with listings and ratings
- `app/admin/` - Admin panel (dashboard, products, orders, customers)
- `app/add-product/` - Product listing creation (multi-image upload)

The root `layout.tsx` is a client component that wraps everything with Redux Provider, Auth Context, and renders global modals.

### State Management (dual system)

1. **Redux Toolkit + redux-persist** (`store/`): Primary state for auth, user profile, cart, wishlist. Persisted to localStorage.
2. **React Context** (`context/`): Legacy context for compare, quickview modals, and some cart/wishlist operations. Coexists with Redux.

### Backend: Appwrite

All backend operations go through Appwrite SDK. Configuration is in `lib/appwrite.js` with env vars from `.env.local`:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`  
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`

Database schema is documented in `appwrite.md`. Collections: `products`, `user`, `orders`, `carts`, `wishlists`, `reviews`, `conversations`, `messages`, `offers`, `notifications`, `blogs`, `collections`, `testimonials`.

### Custom Hooks (`hooks/`)

All data operations are encapsulated in hooks:
- `useAuth` - signup, login, logout, session management
- `useCart` - cart CRUD with Redux dispatch
- `useProducts` - search/filter with Appwrite Query API (supports location, condition, userId filters)
- `useDatabase` - generic Appwrite CRUD
- `useOrders` - order lifecycle
- `useReviews` - product reviews
- `useStorage` - file uploads (including multi-image batch upload)
- `useChat` - conversations and messages
- `useWishlist` - wishlist management
- `useUser` - user profile operations
- `useSeller` - seller profile aggregation (listings, ratings, response time)
- `useOffers` - price negotiation (make/respond to offers)
- `useNotifications` - in-app notifications (CRUD + unread count)
- `useAdmin` - admin operations (all products/users/orders, stats)

### Styling

- **Bootstrap 5** + **SCSS** (no Tailwind)
- SCSS entry points in `public/scss/` (main.scss, app.scss, _sections.scss, _responsive.scss)
- Components use glassmorphism style (semi-transparent bg, backdrop-filter blur, rounded-4)

### Type Definitions

Central type file at `types/Types.ts` defines interfaces for all domain models (Product, User, Order, Review, Offer, Notification, etc.).

### Data Helpers

- `helpers/dbHelpers.ts` - Transform functions between Appwrite documents and app types (toProduct, toOrder, toOffer, toNotification, etc.)
- `helpers/common.ts` - General utilities
- `data/` - Static data files for products, categories, blogs, menu items

### Feature Documentation

All features are documented in `docs/` — see `docs/README.md` for the index.

### Key Patterns

- Image optimization is disabled in `next.config.mjs` (`unoptimized: true`) since images come from Appwrite storage URLs
- Products have a `userId` field linking them to the seller (C2C model)
- Products marked `isNegotiable` support the offer/counter-offer flow
- Path alias: `@/*` maps to project root
- `_legacy/` directory is excluded from TypeScript compilation
- Note: utilities directory is named `utlis/` (misspelled)
- UI language is Spanish (labels, toasts, breadcrumbs)
