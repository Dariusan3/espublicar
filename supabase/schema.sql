-- ============================================================
-- espublicar — Supabase schema (migrated from Appwrite)
-- ============================================================
-- Column names intentionally match the old Appwrite attribute names
-- (camelCase, quoted) so the app code keeps working unchanged.
-- System fields:  id (uuid) / created_at / updated_at.
-- Foreign-reference columns are stored as text (they hold auth uuid strings)
-- to avoid cast errors and mirror Appwrite's string-id semantics.
-- ============================================================

create extension if not exists pg_trgm;

-- ------------------------------------------------------------
-- products
-- ------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  "productId"   bigint,
  title         text not null,
  price         double precision not null default 0,
  oldprice      double precision,
  category      text,
  "imgSrc"      text,
  "imgHover"    text,
  "thumbImages" text[] default '{}',
  description   text,
  rating        double precision default 0,
  "inStock"     boolean default true,
  "isNew"       boolean default false,
  "isTodaysDeals" boolean default false,
  "hotSale"     boolean default false,
  "salePercentage" text,
  "filterBrands" text[] default '{}',
  sold          integer default 0,
  available     integer default 0,
  "userId"      text,
  condition     text,
  location      text,
  "isNegotiable" boolean default false,
  status        text default 'active',
  views         integer default 0
);
create index if not exists products_user_idx on public.products ("userId");
create index if not exists products_category_idx on public.products (category);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_title_trgm on public.products using gin (title gin_trgm_ops);
create index if not exists products_location_trgm on public.products using gin (location gin_trgm_ops);

-- ------------------------------------------------------------
-- blogs
-- ------------------------------------------------------------
create table if not exists public.blogs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  title       text not null,
  content     text,
  description text,
  "imgSrc"    text,
  tag         text,
  date        timestamptz,
  author      text
);

-- ------------------------------------------------------------
-- collections
-- ------------------------------------------------------------
create table if not exists public.collections (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  title         text not null,
  "imgSrc"      text,
  sale          text,
  "productText" text,
  "darkText"    boolean default false
);

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  name           text not null,
  "imgSrc"       text,
  text           text not null,
  rating         integer default 5,
  date           timestamptz,
  verified       boolean default false,
  "productColor" text
);

-- ------------------------------------------------------------
-- user (profile row; id equals the auth.users id)
-- ------------------------------------------------------------
create table if not exists public."user" (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  name         text,
  email        text,
  phone        text,
  "avatarUrl"  text,
  address      text,
  city         text,
  country      text,
  "postalCode" text
);

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  "userId"          text not null,
  items             text not null,          -- JSON string of cart items
  "totalAmount"     double precision not null default 0,
  status            text not null default 'pending',
  "shippingAddress" text,
  "paymentMethod"   text,
  "paymentStatus"   text default 'pending',
  "trackingNumber"  text,
  notes             text
);
create index if not exists orders_user_idx on public.orders ("userId");

-- ------------------------------------------------------------
-- wishlists
-- ------------------------------------------------------------
create table if not exists public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  "userId"    text not null,
  "productId" text not null
);
create index if not exists wishlists_user_idx on public.wishlists ("userId");

-- ------------------------------------------------------------
-- carts
-- ------------------------------------------------------------
create table if not exists public.carts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  "userId"    text not null,
  "productId" text not null,
  quantity    integer not null default 1
);
create index if not exists carts_user_idx on public.carts ("userId");

-- ------------------------------------------------------------
-- reviews
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  "userId"     text not null,
  "userName"   text,
  "userAvatar" text,
  "productId"  text not null,
  rating       integer not null default 5,
  title        text,
  content      text,
  verified     boolean default false
);
create index if not exists reviews_product_idx on public.reviews ("productId");

-- ------------------------------------------------------------
-- conversations
-- ------------------------------------------------------------
create table if not exists public.conversations (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  participants          text[] not null default '{}',
  "productId"           text,
  "lastMessage"         text,
  "lastMessageAuthorId" text,
  "lastMessageAt"       timestamptz
);
create index if not exists conversations_participants_idx on public.conversations using gin (participants);

-- ------------------------------------------------------------
-- messages
-- ------------------------------------------------------------
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  "conversationId" text not null,
  "senderId"       text not null,
  text             text not null,
  "isRead"         boolean default false
);
create index if not exists messages_conversation_idx on public.messages ("conversationId");

-- ------------------------------------------------------------
-- offers
-- ------------------------------------------------------------
create table if not exists public.offers (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  "productId"     text not null,
  "buyerId"       text not null,
  "sellerId"      text not null,
  amount          double precision not null,
  status          text not null default 'pending',
  "counterAmount" double precision,
  message         text
);
create index if not exists offers_product_idx on public.offers ("productId");
create index if not exists offers_buyer_idx on public.offers ("buyerId");
create index if not exists offers_seller_idx on public.offers ("sellerId");

-- ------------------------------------------------------------
-- notifications
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  "userId"        text not null,
  type            text not null default 'system',
  title           text not null,
  body            text,
  "referenceId"   text,
  "referenceType" text,
  "isRead"        boolean default false
);
create index if not exists notifications_user_idx on public.notifications ("userId");

-- ------------------------------------------------------------
-- reports
-- ------------------------------------------------------------
create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  "reporterId"  text not null,
  "targetId"    text not null,
  "targetType"  text not null,
  reason        text not null,
  description   text,
  status        text not null default 'pending'
);

-- ============================================================
-- Row Level Security
-- ============================================================
-- The web client uses the public anon key + Supabase auth sessions.
-- Public tables are world-readable; private tables are scoped to auth.uid().
-- NOTE: admin/moderation operations (read all users/orders, edit any product)
-- require the service-role key on a server route — the anon client is
-- intentionally blocked from them by these policies.

alter table public.products      enable row level security;
alter table public.blogs         enable row level security;
alter table public.collections   enable row level security;
alter table public.testimonials  enable row level security;
alter table public."user"        enable row level security;
alter table public.orders        enable row level security;
alter table public.wishlists     enable row level security;
alter table public.carts         enable row level security;
alter table public.reviews       enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.offers        enable row level security;
alter table public.notifications enable row level security;
alter table public.reports       enable row level security;

-- ---- Public read tables ----
drop policy if exists products_read on public.products;
create policy products_read on public.products for select using (true);
drop policy if exists blogs_read on public.blogs;
create policy blogs_read on public.blogs for select using (true);
drop policy if exists collections_read on public.collections;
create policy collections_read on public.collections for select using (true);
drop policy if exists testimonials_read on public.testimonials;
create policy testimonials_read on public.testimonials for select using (true);
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select using (true);
drop policy if exists user_read on public."user";
create policy user_read on public."user" for select using (true);

-- ---- products: owner writes ----
drop policy if exists products_insert on public.products;
create policy products_insert on public.products for insert to authenticated
  with check (auth.uid()::text = "userId");
drop policy if exists products_update on public.products;
create policy products_update on public.products for update to authenticated
  using (auth.uid()::text = "userId");
drop policy if exists products_delete on public.products;
create policy products_delete on public.products for delete to authenticated
  using (auth.uid()::text = "userId");

-- ---- user: self insert/update ----
drop policy if exists user_insert on public."user";
create policy user_insert on public."user" for insert to authenticated
  with check (auth.uid() = id);
drop policy if exists user_update on public."user";
create policy user_update on public."user" for update to authenticated
  using (auth.uid() = id);

-- ---- orders: owner ----
drop policy if exists orders_rw on public.orders;
create policy orders_rw on public.orders for all to authenticated
  using (auth.uid()::text = "userId")
  with check (auth.uid()::text = "userId");

-- ---- carts: owner ----
drop policy if exists carts_rw on public.carts;
create policy carts_rw on public.carts for all to authenticated
  using (auth.uid()::text = "userId")
  with check (auth.uid()::text = "userId");

-- ---- wishlists: owner ----
drop policy if exists wishlists_rw on public.wishlists;
create policy wishlists_rw on public.wishlists for all to authenticated
  using (auth.uid()::text = "userId")
  with check (auth.uid()::text = "userId");

-- ---- reviews: author writes ----
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert to authenticated
  with check (auth.uid()::text = "userId");
drop policy if exists reviews_update on public.reviews;
create policy reviews_update on public.reviews for update to authenticated
  using (auth.uid()::text = "userId");
drop policy if exists reviews_delete on public.reviews;
create policy reviews_delete on public.reviews for delete to authenticated
  using (auth.uid()::text = "userId");

-- ---- offers: buyer & seller ----
drop policy if exists offers_read on public.offers;
create policy offers_read on public.offers for select to authenticated
  using (auth.uid()::text in ("buyerId", "sellerId"));
drop policy if exists offers_insert on public.offers;
create policy offers_insert on public.offers for insert to authenticated
  with check (auth.uid()::text = "buyerId");
drop policy if exists offers_update on public.offers;
create policy offers_update on public.offers for update to authenticated
  using (auth.uid()::text in ("buyerId", "sellerId"));

-- ---- conversations: participants ----
drop policy if exists conversations_read on public.conversations;
create policy conversations_read on public.conversations for select to authenticated
  using (auth.uid()::text = any(participants));
drop policy if exists conversations_insert on public.conversations;
create policy conversations_insert on public.conversations for insert to authenticated
  with check (auth.uid()::text = any(participants));
drop policy if exists conversations_update on public.conversations;
create policy conversations_update on public.conversations for update to authenticated
  using (auth.uid()::text = any(participants));

-- ---- messages: any authenticated may read; sender may insert ----
-- (kept simple; tighten with a participants sub-select if needed)
drop policy if exists messages_read on public.messages;
create policy messages_read on public.messages for select to authenticated
  using (true);
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert to authenticated
  with check (auth.uid()::text = "senderId");

-- ---- notifications: owner reads/updates; any authenticated may create
--       (offers/messages notify the *other* user) ----
drop policy if exists notifications_read on public.notifications;
create policy notifications_read on public.notifications for select to authenticated
  using (auth.uid()::text = "userId");
drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications for update to authenticated
  using (auth.uid()::text = "userId");
drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert on public.notifications for insert to authenticated
  with check (true);

-- ---- reports: reporter inserts, reads own ----
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert to authenticated
  with check (auth.uid()::text = "reporterId");
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select to authenticated
  using (auth.uid()::text = "reporterId");

-- ============================================================
-- Storage: single public bucket "images"
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists images_public_read on storage.objects;
create policy images_public_read on storage.objects for select
  using (bucket_id = 'images');

drop policy if exists images_auth_insert on storage.objects;
create policy images_auth_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'images');

drop policy if exists images_auth_update on storage.objects;
create policy images_auth_update on storage.objects for update to authenticated
  using (bucket_id = 'images');

drop policy if exists images_auth_delete on storage.objects;
create policy images_auth_delete on storage.objects for delete to authenticated
  using (bucket_id = 'images');
