# Seller Profile Pages

Public seller profile pages showing a seller's listings, rating, and info.

## Route

`/seller/[id]` — where `[id]` is the seller's Appwrite user ID.

## How It Works

1. `useSeller` hook fetches user document, their products, and aggregates reviews across all their products
2. `SellerProfileCard` displays seller avatar (initial), name, join date, city, stats (listings count, average rating, reviews count), and star rating
3. `SellerListings` renders a product grid of all seller's listings using Bootstrap cards
4. Product detail page has "Ver perfil del vendedor" link

## Files Created

- `hooks/useSeller.ts` — `getSellerProfile(userId)` returns `SellerProfile` with user data, listings, aggregate rating, review count
- `components/seller/SellerProfileCard.tsx` — Glassmorphism-style card with seller stats
- `components/seller/SellerListings.tsx` — Product grid with condition badges, prices, and locations
- `app/seller/[id]/page.tsx` — Page component with breadcrumbs, loading state, error state

## Files Modified

- `components/product-detail/Details1.tsx` — Added "Ver perfil del vendedor" link button
- `hooks/useProducts.ts` — Added `userId` filter to `ProductFilters` and `searchProducts`
- `hooks/index.ts` — Exports `useSeller`

## SellerProfile Interface

```ts
interface SellerProfile {
  user: User;
  listings: Product[];
  totalListings: number;
  averageRating: number;
  totalReviews: number;
  joinedDate: string;
}
```
