-- ============================================================
-- espublicar — add enforced foreign-key relationships
-- ============================================================
-- Converts the text reference columns to uuid, adds FK constraints
-- (with cascade behaviour), and rewrites the affected RLS policies to
-- compare uuids directly. Safe to run on an empty database.
--
-- Order matters: a policy that references a column blocks ALTER COLUMN TYPE,
-- so dependent policies are dropped first and recreated at the end.
-- ============================================================

-- ---- 1. Drop policies that reference the columns we're about to retype ----
drop policy if exists products_insert on public.products;
drop policy if exists products_update on public.products;
drop policy if exists products_delete on public.products;
drop policy if exists orders_rw on public.orders;
drop policy if exists carts_rw on public.carts;
drop policy if exists wishlists_rw on public.wishlists;
drop policy if exists reviews_insert on public.reviews;
drop policy if exists reviews_update on public.reviews;
drop policy if exists reviews_delete on public.reviews;
drop policy if exists offers_read on public.offers;
drop policy if exists offers_insert on public.offers;
drop policy if exists offers_update on public.offers;
drop policy if exists messages_insert on public.messages;
drop policy if exists notifications_read on public.notifications;
drop policy if exists notifications_update on public.notifications;
drop policy if exists reports_insert on public.reports;
drop policy if exists reports_read on public.reports;

-- ---- 2. Convert reference columns text -> uuid ----
alter table public.products
  alter column "userId" type uuid using nullif("userId", '')::uuid;

alter table public.orders
  alter column "userId" type uuid using nullif("userId", '')::uuid;

alter table public.carts
  alter column "userId" type uuid using nullif("userId", '')::uuid,
  alter column "productId" type uuid using nullif("productId", '')::uuid;

alter table public.wishlists
  alter column "userId" type uuid using nullif("userId", '')::uuid,
  alter column "productId" type uuid using nullif("productId", '')::uuid;

alter table public.reviews
  alter column "userId" type uuid using nullif("userId", '')::uuid,
  alter column "productId" type uuid using nullif("productId", '')::uuid;

alter table public.offers
  alter column "buyerId" type uuid using nullif("buyerId", '')::uuid,
  alter column "sellerId" type uuid using nullif("sellerId", '')::uuid,
  alter column "productId" type uuid using nullif("productId", '')::uuid;

alter table public.conversations
  alter column "productId" type uuid using nullif("productId", '')::uuid,
  alter column "lastMessageAuthorId" type uuid using nullif("lastMessageAuthorId", '')::uuid;

alter table public.messages
  alter column "conversationId" type uuid using nullif("conversationId", '')::uuid,
  alter column "senderId" type uuid using nullif("senderId", '')::uuid;

alter table public.notifications
  alter column "userId" type uuid using nullif("userId", '')::uuid;

alter table public.reports
  alter column "reporterId" type uuid using nullif("reporterId", '')::uuid;

-- ---- 3. Foreign keys ----
-- NOTE: user-reference columns point at auth.users (always present after signup);
-- targetId/referenceId stay text (polymorphic) and get no FK.
alter table public."user"
  add constraint user_id_fk foreign key (id) references auth.users(id) on delete cascade;

alter table public.products
  add constraint products_user_fk foreign key ("userId") references auth.users(id) on delete cascade;

alter table public.orders
  add constraint orders_user_fk foreign key ("userId") references auth.users(id) on delete cascade;

alter table public.carts
  add constraint carts_user_fk foreign key ("userId") references auth.users(id) on delete cascade,
  add constraint carts_product_fk foreign key ("productId") references public.products(id) on delete cascade;

alter table public.wishlists
  add constraint wishlists_user_fk foreign key ("userId") references auth.users(id) on delete cascade,
  add constraint wishlists_product_fk foreign key ("productId") references public.products(id) on delete cascade;

alter table public.reviews
  add constraint reviews_user_fk foreign key ("userId") references auth.users(id) on delete cascade,
  add constraint reviews_product_fk foreign key ("productId") references public.products(id) on delete cascade;

alter table public.offers
  add constraint offers_buyer_fk foreign key ("buyerId") references auth.users(id) on delete cascade,
  add constraint offers_seller_fk foreign key ("sellerId") references auth.users(id) on delete cascade,
  add constraint offers_product_fk foreign key ("productId") references public.products(id) on delete cascade;

alter table public.conversations
  add constraint conversations_product_fk foreign key ("productId") references public.products(id) on delete set null,
  add constraint conversations_lastauthor_fk foreign key ("lastMessageAuthorId") references auth.users(id) on delete set null;

alter table public.messages
  add constraint messages_conversation_fk foreign key ("conversationId") references public.conversations(id) on delete cascade,
  add constraint messages_sender_fk foreign key ("senderId") references auth.users(id) on delete cascade;

alter table public.notifications
  add constraint notifications_user_fk foreign key ("userId") references auth.users(id) on delete cascade;

alter table public.reports
  add constraint reports_reporter_fk foreign key ("reporterId") references auth.users(id) on delete cascade;

-- ---- 4. Recreate RLS policies with uuid comparisons ----
create policy products_insert on public.products for insert to authenticated
  with check (auth.uid() = "userId");
create policy products_update on public.products for update to authenticated
  using (auth.uid() = "userId");
create policy products_delete on public.products for delete to authenticated
  using (auth.uid() = "userId");

create policy orders_rw on public.orders for all to authenticated
  using (auth.uid() = "userId") with check (auth.uid() = "userId");

create policy carts_rw on public.carts for all to authenticated
  using (auth.uid() = "userId") with check (auth.uid() = "userId");

create policy wishlists_rw on public.wishlists for all to authenticated
  using (auth.uid() = "userId") with check (auth.uid() = "userId");

create policy reviews_insert on public.reviews for insert to authenticated
  with check (auth.uid() = "userId");
create policy reviews_update on public.reviews for update to authenticated
  using (auth.uid() = "userId");
create policy reviews_delete on public.reviews for delete to authenticated
  using (auth.uid() = "userId");

create policy offers_read on public.offers for select to authenticated
  using (auth.uid() in ("buyerId", "sellerId"));
create policy offers_insert on public.offers for insert to authenticated
  with check (auth.uid() = "buyerId");
create policy offers_update on public.offers for update to authenticated
  using (auth.uid() in ("buyerId", "sellerId"));

create policy messages_insert on public.messages for insert to authenticated
  with check (auth.uid() = "senderId");

create policy notifications_read on public.notifications for select to authenticated
  using (auth.uid() = "userId");
create policy notifications_update on public.notifications for update to authenticated
  using (auth.uid() = "userId");

create policy reports_insert on public.reports for insert to authenticated
  with check (auth.uid() = "reporterId");
create policy reports_read on public.reports for select to authenticated
  using (auth.uid() = "reporterId");
