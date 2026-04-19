# espublicar — Feature Documentation

espublicar is a C2C second-hand marketplace built with Next.js 15, React 19, and Appwrite.

## Features

| Feature | Doc | Status |
|---------|-----|--------|
| Multi-Image Upload | [multi-image-upload.md](multi-image-upload.md) | Done |
| Location & Condition Filters | [location-condition-filters.md](location-condition-filters.md) | Done |
| Seller Profiles | [seller-profile.md](seller-profile.md) | Done |
| Offers / Price Negotiation | [offers-negotiation.md](offers-negotiation.md) | Done |
| Notifications | [notifications.md](notifications.md) | Done |
| Admin Panel | [admin-panel.md](admin-panel.md) | Done |

## Architecture

All features follow the same pattern:
- **Types** defined in `types/Types.ts`
- **Appwrite collection IDs** registered in `lib/appwrite.js`
- **DB helpers** (document-to-type converters) in `helpers/dbHelpers.ts`
- **Custom hooks** in `hooks/` encapsulating all Appwrite operations
- **Components** in `components/` organized by feature
- **Pages** in `app/` using Next.js App Router

## Appwrite Collections

| Collection | Purpose |
|-----------|---------|
| `products` | Product listings |
| `user` | User profiles |
| `orders` | Purchase orders |
| `carts` | Shopping cart items |
| `wishlists` | Wishlist items |
| `reviews` | Product reviews |
| `conversations` | Chat conversations |
| `messages` | Chat messages |
| `offers` | Price negotiations |
| `notifications` | In-app notifications |
| `blogs` | Blog posts |
| `collections` | Product collections/categories |
| `testimonials` | Customer testimonials |
