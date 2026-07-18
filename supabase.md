# Supabase Backend

The app was migrated from Appwrite to Supabase. To provision a project, run
these two SQL files in order in the Supabase SQL editor (or via the Management
API / MCP):

1. [`supabase/schema.sql`](supabase/schema.sql) — tables, RLS policies, indexes,
   Storage bucket.
2. [`supabase/002_relations.sql`](supabase/002_relations.sql) — converts the
   reference columns to `uuid` and adds enforced foreign keys with cascade
   behaviour, then rewrites the affected RLS policies to compare uuids.

## Relationships

Foreign keys (all `on delete cascade` unless noted):

- `user.id`, `products.userId`, `orders.userId`, `carts.userId`,
  `wishlists.userId`, `reviews.userId`, `offers.buyerId`, `offers.sellerId`,
  `messages.senderId`, `notifications.userId`, `reports.reporterId` → `auth.users(id)`
- `carts.productId`, `wishlists.productId`, `reviews.productId`,
  `offers.productId` → `products(id)`
- `messages.conversationId` → `conversations(id)`
- `conversations.productId`, `conversations.lastMessageAuthorId` → `products` /
  `auth.users` (**on delete set null**)

Polymorphic columns keep no FK: `notifications.referenceId`,
`reports.targetId`. `conversations.participants` stays `text[]`.

## Conventions

- **System fields:** every table has `id uuid`, `created_at timestamptz`,
  `updated_at timestamptz`. The transform helpers in `helpers/dbHelpers.ts`
  map these to the app's `id` / `createdAt` / `updatedAt`.
- **Column names** keep the original Appwrite attribute names (quoted camelCase,
  e.g. `"imgSrc"`, `"userId"`, `"isNegotiable"`) so the app code is unchanged.
- **Foreign-reference columns** (`userId`, `productId`, `buyerId`, `sellerId`,
  `conversationId`, `senderId`, `reporterId`, `targetId`, …) are `text`. They
  hold auth-user UUID strings but are typed as text to mirror Appwrite's string
  ids and avoid cast errors.

## Tables

`products`, `blogs`, `collections`, `testimonials`, `user`, `orders`,
`wishlists`, `carts`, `reviews`, `conversations`, `messages`, `offers`,
`notifications`, `reports`.

The `user` table's `id` equals the `auth.users` id (the profile row is created
by the app right after sign-up, and in `app/auth/callback` for OAuth).

## Auth

- Supabase Auth (email/password + Google/Facebook OAuth).
- The Supabase user is normalized to an Appwrite-ish shape (`$id`, `name`,
  `emailVerification`, `phoneVerification`, `prefs`) in `lib/supabase.js`
  (`account.get()`) and `context/AuthContext.tsx`.
- **Disable "Confirm email"** under Authentication → Providers → Email so the
  register → auto-login flow works (matching the old Appwrite behaviour).
- OAuth redirect URL: `<site>/auth/callback`. Add it to the provider config and
  to Authentication → URL Configuration → Redirect URLs.

## Storage

- Single public bucket `images` (configurable via `NEXT_PUBLIC_SUPABASE_BUCKET`).
- Public read; authenticated write. Public URLs are used directly as image src.

## Row Level Security

RLS is enabled on all tables:

- **Public read:** `products`, `blogs`, `collections`, `testimonials`,
  `reviews`, `user`.
- **Owner-scoped** (via `auth.uid()`): `orders`, `carts`, `wishlists`,
  `reviews` writes, `offers` (buyer+seller), `conversations` (participants),
  `notifications` (owner reads; any authed user may create — offers/messages
  notify the other party).

> Admin/moderation operations (read all users/orders, edit any product) are
> intentionally blocked for the anon client. Implement them on a server route
> using the **service-role key**.

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_BUCKET=images
STRIPE_SECRET_KEY=...   # server-side checkout
```
