# ProductCard Redesign Spec

**Target file**: `components/productCards/ProductCard1.tsx`

## Goal

Transform the current e-commerce product card (with countdown timer, sold progress bar, 4-action column, Sale badge) into a **clean P2P listing card** that matches Vinted/Wallapop density.

## Anatomy

```
┌─────────────────────┐
│                     │
│       image         │ ← 1:1 aspect, radius-lg, overflow hidden
│              [♡]    │   heart top-right, glass circle
│                     │
├─────────────────────┤
│ [chip-nuevo] [neg.] │  ← optional chip row
│ iPhone 13 Pro 256GB │  ← 2-line clamp, 15px/600
│ 450 €               │  ← 20px/700, tabular-nums
│ 📍 Madrid · hace 2h │  ← 13px ink-3
└─────────────────────┘
```

Dimensions:
- Width: fluid (grid controls it) — typically 280–320px
- Image: `aspect-ratio: 1 / 1`, `border-radius: var(--radius-lg)`, `object-fit: cover`
- Body padding: `var(--space-3) 0 0 0` (no side padding, aligns image edges with text)
- Total stack gap: `var(--space-2)` between chip row / title / price / meta

## Heart button (wishlist)

- Position: absolute, `top: var(--space-3); right: var(--space-3)`
- Size: 36×36, `border-radius: 50%`
- Background: `rgba(255,255,255,0.9)` + `backdrop-filter: blur(6px)`
- Icon: outline heart 18px, stroke `var(--ink-2)`
- Active / wishlisted: fill `var(--danger)`, stroke `var(--danger)`
- Hover: scale 1.08, `--elev-2`
- Transition: `all 150ms var(--ease-out)`

## Chips row

Max 2 chips, horizontal gap `var(--space-1)`:
- **Condition**: `.chip-soft` with text "Nuevo" / "Como nuevo" / "Buen estado" / "Aceptable"
- **Negociable**: `.chip-success` with text "Negociable"

Hide entirely if neither applies.

## Title

```tsx
<Link href={`/product-detail/${product.id}`} className="card-title">
  {product.title}
</Link>
```

```scss
.card-title {
  display: block;
  font: 600 15px/1.35 "Inter";
  color: var(--ink);
  letter-spacing: -0.01em;
  @include clamp-lines(2);
  min-height: calc(15px * 1.35 * 2); // reserve 2 lines
  &:hover { color: var(--brand); }
}
```

## Price

```tsx
<div className="card-price num">
  <span className="price-now">{product.price.toFixed(0)} €</span>
  {product.oldprice && <span className="price-was">{product.oldprice.toFixed(0)} €</span>}
</div>
```

```scss
.card-price {
  font: 700 20px/1.2 "Inter";
  color: var(--ink);
  .price-was {
    margin-left: var(--space-2);
    font-weight: 500; font-size: 14px;
    color: var(--ink-4);
    text-decoration: line-through;
  }
}
```

No decimals for EUR prices in listings (round to int). Only show decimals when < 100 €.

## Meta row (location + time)

```tsx
<div className="card-meta text-ink-3">
  <MapPinIcon size={12} />
  <span>{product.location}</span>
  <span className="dot" />
  <span>{product.timeAgo}</span>
</div>
```

```scss
.card-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font: 500 13px/1 "Inter";
  .dot { width: 2px; height: 2px; border-radius: 50%; background: var(--ink-4); margin: 0 var(--space-1); }
}
```

## Hover on whole card

```scss
.card-product.style-border {
  cursor: pointer;
  border: 0; // drop old border
  .card-image img { transition: transform 400ms var(--ease-out); }
  &:hover .card-image img { transform: scale(1.03); }
}
```

## Remove entirely

1. `countdown-box` + `js-countdown` + `CountdownTimer` import
2. `product-progress-sale` + "Sold:" / "Available:" block
3. `list-image-product` hover swap (keep if Appwrite returns thumbs — but not essential for V1)
4. `box-sale-wrap` (Sale / salePercentage)
5. `AddToCart`, `AddToQuickview`, `AddToCompare` — P2P listings aren't cart items, they're contact-seller flows. Keep `AddToWishlist` only.
6. The entire `box-infor-detail` block

## Keep (Redux wiring)

- `AddToWishlist` component — just change its styling to match the heart icon above. Keep `productId` prop and dispatch.

## Props interface

```ts
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    oldprice?: number;
    imgSrc: string;
    condition?: "Nuevo" | "Como nuevo" | "Buen estado" | "Aceptable";
    isNegotiable?: boolean;
    location?: string;
    timeAgo?: string;   // "hace 2h", "hace 3d", etc. — pre-formatted server-side
    sellerName?: string;
    sellerAvatar?: string;
  };
  index: number;        // kept for stagger animation, optional
  showSeller?: boolean; // default false
}
```

## Optional seller row (when `showSeller`)

Below meta, add:

```tsx
<div className="card-seller">
  <img src={product.sellerAvatar || fallback} className="avatar-xs" />
  <span>{product.sellerName}</span>
</div>
```

```scss
.card-seller {
  display: inline-flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-2);
  font: 500 12px/1 "Inter"; color: var(--ink-3);
  .avatar-xs { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; }
}
```
