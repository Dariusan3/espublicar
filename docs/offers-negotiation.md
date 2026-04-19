# Offers / Price Negotiation

Allows buyers to make offers on products marked as negotiable (`isNegotiable: true`), and sellers to accept, reject, or counter.

## Appwrite Collection: `offers`

| Attribute | Type | Description |
|-----------|------|-------------|
| `productId` | String | Product being negotiated |
| `buyerId` | String | Buyer's user ID |
| `sellerId` | String | Seller's user ID |
| `amount` | Float | Offered price |
| `status` | String | `pending` / `accepted` / `rejected` / `countered` / `expired` |
| `counterAmount` | Float | Seller's counter-offer amount (optional) |
| `message` | String | Buyer's message (optional) |

## How It Works

1. On product detail page, if `product.isNegotiable` and the viewer isn't the seller, a "Hacer una oferta" button appears
2. Clicking opens `MakeOfferModal` — buyer enters an amount and optional message
3. `useOffers.makeOffer()` creates the offer (prevents duplicate pending offers)
4. Seller views offers in dashboard → "Mis ofertas" → "Recibidas" tab
5. Seller can Accept, Reject, or Counter (with a price input) each pending offer
6. Buyer views their sent offers in the "Enviadas" tab

## Files Created

- `hooks/useOffers.ts` — `makeOffer`, `getOffersForProduct`, `getMyOffers`, `getOffersForSeller`, `respondToOffer`
- `components/modals/MakeOfferModal.tsx` — Modal form with price input and message
- `components/dashboard/MyOffers.tsx` — Tabbed view (Received/Sent) with offer cards and action buttons
- `app/(dashboard)/my-account-offers/page.tsx` — Dashboard page

## Files Modified

- `types/Types.ts` — Added `Offer`, `OfferDB` interfaces
- `helpers/dbHelpers.ts` — Added `toOffer`, `toOffers` converters
- `lib/appwrite.js` — Added `OFFERS_COLLECTION_ID` and `COLLECTIONS.OFFERS`
- `components/product-detail/Details1.tsx` — Real offer modal instead of placeholder toast
- `components/dashboard/Sidebar.tsx` — Added "Mis ofertas" menu item
- `hooks/index.ts` — Exports `useOffers`

## Offer Flow

```
Buyer → "Hacer una oferta" → amount + message
  → Seller receives offer (dashboard)
    → Accept → deal agreed
    → Reject → offer closed
    → Counter → buyer sees counter amount
```
