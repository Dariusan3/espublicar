# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**espublicar** is a C2C second-hand marketplace (like OLX/Wallapop) built with Next.js 15 (App Router) and React 19, using Supabase as the backend-as-a-service. Users can list products for sale, browse/buy products, negotiate prices, message sellers, and manage orders through a dashboard.

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

### Backend: Supabase

All backend operations go through the Supabase SDK (`@supabase/supabase-js`). Configuration is in `lib/supabase.js` with env vars from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_BUCKET` (public Storage bucket, default `images`)

`lib/supabase.js` exports the `supabase` client plus a **compatibility layer** (`account`, `db`/`databases`, `storage`, `Query`, `ID`) that preserves the old Appwrite call surface, so the hooks read almost identically. Postgres system fields are `id` / `created_at` / `updated_at` (the transform helpers in `helpers/dbHelpers.ts` map these). Table columns keep the original attribute names (quoted camelCase).

The database schema, RLS policies, and Storage bucket are defined in `supabase/schema.sql` (documented in `supabase.md`). Tables: `products`, `user`, `orders`, `carts`, `wishlists`, `reviews`, `conversations`, `messages`, `offers`, `notifications`, `reports`, `blogs`, `collections`, `testimonials`.

Auth uses Supabase Auth. The Supabase user is normalized to an Appwrite-ish shape (`$id`, `name`, `emailVerification`, `phoneVerification`, `prefs`) in `context/AuthContext.tsx` and `account.get()` so UI components keep working. **Email confirmation must be disabled** in the Supabase Auth settings for the register → auto-login flow to work. Admin/moderation reads (all users/orders, edit any product) are blocked by RLS on the anon client and need a service-role server route.

### Custom Hooks (`hooks/`)

All data operations are encapsulated in hooks:
- `useAuth` - signup, login, logout, session management
- `useCart` - cart CRUD with Redux dispatch
- `useProducts` - search/filter with the Query API (compat layer over Supabase) (supports location, condition, userId filters)
- `useDatabase` - generic CRUD (compat layer over Supabase)
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

- `helpers/dbHelpers.ts` - Transform functions between Supabase rows and app types (toProduct, toOrder, toOffer, toNotification, etc.)
- `helpers/common.ts` - General utilities
- `data/` - Static data files for products, categories, blogs, menu items

### Feature Documentation

All features are documented in `docs/` — see `docs/README.md` for the index.

### Key Patterns

- Image optimization is disabled in `next.config.mjs` (`unoptimized: true`) since images come from Supabase Storage URLs
- Products have a `userId` field linking them to the seller (C2C model)
- Products marked `isNegotiable` support the offer/counter-offer flow
- Path alias: `@/*` maps to project root
- `_legacy/` directory is excluded from TypeScript compilation
- Note: utilities directory is named `utlis/` (misspelled)
- UI language is Spanish (labels, toasts, breadcrumbs)

## Design Context

Strategic + visual design system captured in `PRODUCT.md` (register, users, principles) and `DESIGN.md` (tokens, colors, typography, components). Read both before UI work; `/impeccable <command>` reads them automatically.

- **Register:** product (design serves the app; homepage is a front door). **Platform:** web, mobile-first.
- **North Star:** "The Trusted Corner Shop" — warm, local, safe. Trust rendered as UI, not slogans.
- **Brand color:** Trust Blue `#2563EB`, kept scarce (≤10% of a screen) for actions + trust signals. Neutrals (`--ink*`, `--surface*`) carry the rest. Tokens live in `public/scss/abstracts/_variable.scss`.
- **Type:** Inter only; hierarchy via weight + size (no second family). Prices use `tabular-nums`.
- **A11y target:** WCAG AA + honor `prefers-reduced-motion`; visible `:focus-visible` on all interactive elements.
- **Anti-references (never look like):** generic SaaS template, luxury boutique, cold corporate/bank, cheap spammy classifieds.
