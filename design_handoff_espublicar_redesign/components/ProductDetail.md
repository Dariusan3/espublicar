# Product Detail Spec

**Target**: `app/(product-detail)/product-detail/[id]/page.tsx` + `components/product-detail/Details1.tsx` + `Description.tsx` + `sliders/Slider1.tsx`

## Page layout

- Container: `max-width: 1280px`, padding `var(--space-7) var(--space-6)`
- Breadcrumb row at top (14px `--ink-3`): `Inicio › Móvil › iPhone 13 Pro 256GB`
- Main grid: 2 columns desktop `grid-template-columns: 1.2fr 1fr; gap: var(--space-9);`
- Below main: `Description` section, then `SimilerProducts` grid (drop related-products — same seller works better)

## Left column — Gallery

**Target**: `components/product-detail/sliders/Slider1.tsx`

### Hero image

- Aspect 4:5, `--radius-lg`, `--elev-1`
- Click: opens PhotoSwipe lightbox (keep existing integration)
- Zoom on hover: keep `drift-zoom` if it works — otherwise drop it

### Thumbnails

Row of 5 thumbnails below hero:
- Size: 80×80, `--radius-md`
- Active: 2px `--brand` border ring + scale 1.04
- Inactive: 1px `--line` border
- Gap: `var(--space-2)`

Drop any "thumbs-left", "thumbs-right", "inner-zoom", "circle-zoom" variants — standardize on thumbs-below only.

## Right column — Info panel

Vertical stack, `var(--space-5)` gap between blocks.

### 1. Chip row

`[Como nuevo]  [Negociable]  [Envío disponible]`

### 2. Title

`h1`, 28px/700 `--ink`, letter-spacing -0.02em. No "Product code: SKU-123" metadata.

### 3. Price

```tsx
<div className="pd-price num">
  <span className="now">450 €</span>
  <span className="was">520 €</span>
  <span className="chip chip-success">-13 %</span>
</div>
```

- Now: 36px/700 `--ink`, tabular-nums
- Was: 18px/500 `--ink-4` strikethrough
- Discount chip: `.chip-success`

### 4. Meta strip

```tsx
<div className="pd-meta text-ink-3">
  <span>📍 Madrid, Chamberí</span> · <span>Publicado hace 2 h</span> · <span>98 visitas</span>
</div>
```

14px Inter 500 `--ink-3`, gap `var(--space-2)`.

### 5. CTA row

```tsx
<div className="pd-cta stack-3">
  <button className="btn-brand btn-lg btn-block">Contactar al vendedor</button>
  <button className="btn-ghost btn-lg btn-block">Hacer una oferta</button>
</div>
```

No "Add to cart", no "Buy now", no "Add to wishlist" button here — the wishlist heart is a small icon button to the right of the title.

### 6. Seller card

```
┌────────────────────────────────────────┐
│ [avatar]  María Gómez                  │
│           ★★★★★ (4.9) · 124 ventas    │
│                              Ver perfil│
└────────────────────────────────────────┘
```

- Background: `var(--surface-3)`
- Padding: `var(--space-4)`
- `--radius-lg`
- Avatar: 48px circle
- Name: 16px/600 `--ink`
- Meta: 13px `--ink-3`
- "Ver perfil" link: right-aligned, `--brand`, 14px

### 7. Trust strip

3 small trust items in a row, each with icon + label:

`🛡 Pago seguro`  `🚚 Envío con seguimiento`  `↩ Reembolso si no llega`

14px `--ink-2`, gap `var(--space-5)`.

Replace emoji with monochrome icomoon / Lucide SVG in production.

## Description section

**Target**: `components/product-detail/Description.tsx` — rewrite from scratch.

Drop the tabs (Description / Reviews / Additional info / Size guide). Instead:

```
Descripción
─────────────
[Product description paragraph]
[Another paragraph]

Etiquetas: [iphone] [apple] [256gb] [libre]
```

- Heading: 20px/600 `--ink`, border-bottom `1px var(--line)`, padding-bottom `var(--space-3)`
- Body: 16px/1.7 `--ink-2`, `max-width: 64ch`
- Tag chips: `.chip` style, at bottom

Reviews belong on the seller's **profile** page, not the listing. Drop `ReviewsList.tsx` + `ReviewForm.tsx` from the product detail page.

## Related products section

Rename to **"Más de este vendedor"**. Use `SimilerProducts.tsx` renamed to `SellerMoreListings.tsx`. Same grid styling as home sections.

## Mobile

- Stack: gallery → info panel → description → more from seller
- Gallery: full-width edge-to-edge, hero image 1:1
- CTA row becomes **sticky bottom** (like mobile apps): `Contactar` brand pill full width, `Hacer oferta` ghost pill next to it. Uses `.glass` backdrop.
- Info panel padding: `var(--space-5) var(--space-4)`

## Files to drop / ignore

- `Details2`–`Details8.tsx` variants — only keep `Details1.tsx`
- `Slider2`–`Slider8.tsx` — only keep `Slider1.tsx`
- `Description2`–`Description4.tsx` — only keep `Description.tsx`
- Other route variants: `product-detail-2`, `product-thumbs-left`, `product-inner-zoom`, etc. — delete the folders from `app/(product-detail)/`
