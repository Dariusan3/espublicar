# Migration Guide — espublicar → V2 Minimal

This guide is written for **Claude Code** (or any developer) to execute inside the `Dariusan3/espublicar` repo. Follow phases in order. Each phase ends with a visible, shippable result.

---

## Prerequisites

1. Clone the repo and run `npm install` + `npm run dev` once to confirm the baseline builds.
2. Copy this entire `design_handoff_espublicar_redesign/` folder into the repo root (it will be ignored by Next; it's reference material only).
3. Open `references/espublicar-hifi-v2-minimal.html` in a browser — keep it open while you work, as the source of visual truth.

---

## Phase 1 — Design Tokens (30 min)

**Goal**: swap the color palette, fonts, and add new utility layers. After this phase, the whole app will already look closer to V2 even before component edits.

### 1.1 Replace `_variable.scss`

Replace the contents of `public/scss/abstracts/_variable.scss` with the contents of `tokens/_tokens.scss` from this handoff.

Key deltas vs. current:
- `--primary` changes from `#ff3d3d` (red) → `#2563EB` (blue)
- `--secondary` changes from `#004ec3` (blue) → `#0F172A` (ink)
- Drop Poppins, MADE Outer, UTM Banque, Helvetica Neue — keep Inter only
- New tokens: `--brand`, `--ink`, `--surface`, `--space-*`, `--radius-*`, `--elev-*`, `--glass-*`
- **Keep** existing tokens (`--primary`, `--secondary`, `--gray`, etc.) as aliases so old components don't break — the new file aliases them to the new palette.

### 1.2 Add `_mixins-extra.scss`

Save `tokens/_mixins-extra.scss` to `public/scss/abstracts/_mixins-extra.scss`. Then update `public/scss/abstracts/_index.scss`:

```scss
@forward "variable";
@forward "mixin";
@forward "mixins-extra";
```

### 1.3 Add `_utilities.scss`

Save `tokens/_utilities.scss` to `public/scss/component/_utilities.scss`. Then update `public/scss/component/_index.scss` to `@forward "utilities";` at the bottom.

### 1.4 Update `app/layout.tsx` font loading

- **Remove** the Poppins, Helvetica Neue `<link>` tags.
- **Keep** the Inter `<link>` tag.
- Result: faster page load, single font family.

### 1.5 Sanity check

Run `npm run dev`. The app should still render. Buttons / CTAs should now be blue (`#2563EB`) instead of red (`#ff3d3d`). Body text should feel slightly crisper (Inter on all elements). No layout should break.

Commit: `"Phase 1: swap design tokens to V2 Minimal palette"`

---

## Phase 2 — Header + Footer (1–2 h)

### 2.1 `components/headers/Header1.tsx`

Open `components/Header.md` in this handoff. Apply changes:

- Simplify to 2 rows → **1 row** (merge top + bottom). Remove `header-bottom` row entirely.
- Logo (left) · Search bar (center, flex‑grow) · `Publicar` button + icons (right).
- Search bar: pill‑shaped, `--surface-3` background, `--radius-pill`, icon inside. No dropdown categories on desktop.
- Replace the red "Publicar" button with the new `--brand` primary. Use `.btn-brand` utility (see `_utilities.scss`).
- Remove Compare icon entirely (not relevant for a P2P marketplace).
- Wishlist icon: heart outline, grey. Counter badge uses `--brand`.
- Sign in: when logged out → ghost button "Entrar"; when logged in → avatar circle (initials on `--brand-50` bg).
- Header is **sticky** with `backdrop-filter: blur(12px)` and `background: rgba(255,255,255,0.88)` once scrolled.

### 2.2 `components/footers/Footer1.tsx`

See `components/Footer.md`:

- 4 columns on desktop, accordion on mobile (already implemented — keep).
- Column titles: `Empresa`, `Ayuda`, `Comunidad`, `Legal`.
- Drop the newsletter form from inside the footer — it's a separate modal.
- Payment icons row at bottom — keep but use monochrome SVGs.
- Background: `--ink` (near‑black), text `--ink-4` → `--surface`. Link hover: `--brand-50`.

Commit: `"Phase 2: redesign Header + Footer"`

---

## Phase 3 — ProductCard (1–2 h)

### 3.1 `components/productCards/ProductCard1.tsx`

Open `components/ProductCard.md`. Major changes:

- **Drop the entire countdown timer + sold progress bar** (`countdown-box`, `progress-sold`). Not relevant for P2P — items are unique.
- **Drop** the `Sale` badge box. Keep condition + negotiable chips.
- **Drop** the `AddToCompare` button.
- Image is now 1:1 aspect ratio, radius `--radius-lg`, no visible border. On hover, zoom image 1.02×.
- Wishlist heart icon: absolutely positioned top‑right **inside** the image, white circular bg with `backdrop-filter: blur(6px)`. Fills red on active.
- Title: 2‑line clamp, `font-weight: 600`, size 15px.
- Price: 20px, bold, tabular‑nums. Show original price struck‑through in `--ink-4` next to it if different.
- Location + time ago below: `<MapPin/>` 12px icon + "Madrid · hace 2 h" in `--ink-3` 13px.
- Seller avatar row at bottom (optional, toggled by prop): 20px circular avatar + name.
- Remove the 4‑action column (`list-product-btn`) — only heart remains.

### 3.2 Keep all Redux wiring

Don't touch `AddToWishlist` logic — just restyle the wrapper.

Commit: `"Phase 3: redesign ProductCard to V2 Minimal"`

---

## Phase 4 — Home page (2–3 h)

### 4.1 Rewire `app/page.tsx`

Current imports 14 sections (`Hero`, `Features`, `Products1–6`, `Collections`, `Banner`, `Banner2`, etc.) — most of it is e‑commerce slop. Reduce to:

```tsx
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import Categories from "@/components/homes/home-1/Categories"; // new — see spec
import Products1 from "@/components/homes/home-1/Products1"; // "Cerca de ti"
import Products3 from "@/components/homes/home-1/Products3"; // "Últimas publicaciones"
import HowItWorks from "@/components/homes/home-1/HowItWorks"; // new — see spec
import Footer1 from "@/components/footers/Footer1";

export default function Home() {
  return (
    <>
      <Header1 />
      <Hero />
      <Categories />
      <Products1 />
      <HowItWorks />
      <Products3 />
      <Footer1 />
    </>
  );
}
```

### 4.2 `components/homes/home-1/Hero.tsx`

See `components/Home.md`. New hero:

- Full‑width, 560px tall desktop, 420px mobile.
- Background: `--surface-2` flat (no image). Optional: soft radial gradient `radial-gradient(60% 50% at 70% 30%, var(--brand-50), transparent)` for warmth.
- Left 60%: headline (48px, `--ink`) + sub (18px, `--ink-2`) + **search bar** (large pill, `--radius-pill`, 56px tall, with "¿Qué buscas?" placeholder and a "Buscar" `--brand` button on the right).
- Below search: 4–5 chip suggestions (`iPhone`, `Bicicleta`, `Sofá`, `PS5`, `Cochecito`) — use `.chip` utility.
- Right 40%: a staggered collage of 3 product thumbnails (rotated slightly, radius‑lg, elev‑2). Placeholder images fine.

### 4.3 New `components/homes/home-1/Categories.tsx`

See `components/Home.md`. Grid of 8–12 category tiles. Each tile: circular icon on `--brand-50` bg + label below. Horizontal scroll on mobile.

### 4.4 New `components/homes/home-1/HowItWorks.tsx`

Three steps in 3 columns: "Publica en 1 min", "Chatea con el comprador", "Envía y cobra seguro". Large numeral (72px, `--brand`), title (18px bold), caption (14px `--ink-3`).

### 4.5 Products sections

`Products1.tsx` = "Cerca de ti" with a location chip. `Products3.tsx` = "Últimas publicaciones". Both use the redesigned `ProductCard1` in a 4‑col grid (desktop) / 2‑col (mobile). Remove Swiper — use plain CSS grid.

Commit: `"Phase 4: new Home (Hero + Categories + HowItWorks)"`

---

## Phase 5 — Product Detail (2 h)

Open `components/ProductDetail.md`.

### 5.1 `components/product-detail/Details1.tsx` + `sliders/Slider1.tsx`

- Gallery left (60% desktop): 1 big image + 4 thumbnails underneath. Aspect 4:5. Keep PhotoSwipe zoom.
- Info right (40%): title (28px), price (32px bold), condition + negotiable chips, location, description, seller card, CTAs.
- **Replace "Add to cart" / "Buy now"** with two CTAs: `Contactar` (primary brand) and `Hacer oferta` (ghost).
- Seller card: avatar + name + rating stars + "ver perfil" link. Subtle `--surface-3` bg, 16px padding, radius‑lg.
- Below: "Seguridad con espublicar" trust strip — 3 icons (pago seguro, envío, atención). `--surface-3` card.

### 5.2 `components/product-detail/Description.tsx`

Collapse the tabs (Description / Reviews / etc.) — for a P2P listing, just show a simple description panel and a "Más del vendedor" grid. Move Reviews to the seller's profile page, not the product.

Commit: `"Phase 5: redesign Product Detail for P2P listings"`

---

## Phase 6 — Publish (1 h)

Open `components/Publicar.md`.

### 6.1 `components/dashboard/AddProduct.tsx`

Transform into a 3‑step flow in a single page:

1. **Fotos** — drag‑and‑drop dropzone with dashed `--line-2` border, radius‑xl, 240px tall. Below: thumbnail row of uploaded photos (max 12). First photo is the cover.
2. **Detalles** — title, category (select), condition (chip group), price (with `€` prefix), `negociable` toggle, description textarea.
3. **Envío y ubicación** — location autocomplete, shipping toggle (Envío / Recogida en mano / Ambos).

Sticky footer with `Guardar borrador` (ghost) + `Publicar` (brand). Progress dots top‑left.

Use `.card` + `.stack-6` utility for section spacing. All inputs use `.input-field` (see `_utilities.scss`).

Commit: `"Phase 6: redesign Publish flow"`

---

## Phase 7 — Checkout (1 h)

Open `components/Checkout.md`.

### 7.1 `components/shop-cart/Checkout.tsx`

Simplify dramatically — this isn't a real cart, it's **"Reservar este artículo"** for a single item:

- Left col: item summary (thumbnail + title + price), delivery method (Envío / Recogida), delivery address if envío.
- Right col (sticky): price breakdown (artículo, comisión, envío, total), payment methods (tarjeta / **Bizum** / PayPal — use the real logos), trust bullets ("Pago retenido hasta confirmación", "Reembolso si no llega"), big `Pagar XX,XX €` button.
- Below: "Tus datos están protegidos" strip.

Commit: `"Phase 7: redesign Checkout as single-item reservation"`

---

## Phase 8 — Chat + Account (2 h)

### 8.1 `components/dashboard/ChatInbox.tsx`

Open `components/ChatInbox.md`. Two‑pane layout:

- Left (320px): list of conversations. Each row: avatar + name + last msg preview + time + unread dot (`--brand`).
- Right: header (avatar + name + link to listing), message thread (bubbles: user own = `--brand` bg white text, other = `--surface-3` ink text, radius 16px), composer bar (input + send button), plus **offer inline**: in‑bubble offer card with accept / decline buttons.

### 8.2 `components/dashboard/MyAccount.tsx` + `Sidebar.tsx`

Open `components/MyAccount.md`. Left sidebar nav (pill active state, `--brand-50` bg + `--brand` text), right content area. Dashboard shows stats tiles (ventas, compras, mensajes, valoraciones) + recent activity.

### 8.3 `components/dashboard/MyAccountListings.tsx`

Grid of the user's own listings using redesigned `ProductCard1`, each with a status pill (Activo / Pausado / Vendido) and a `•••` menu (Editar / Pausar / Eliminar).

Commit: `"Phase 8: redesign Chat + Account dashboard"`

---

## Phase 9 — Mobile polish (1 h)

Open `components/Mobile.md`.

### 9.1 `components/modals/MobileMenu.tsx`

Offcanvas drawer from right. Search bar on top, user block, nav links, Publicar as full‑width brand CTA at bottom.

### 9.2 Add bottom tab bar on mobile

For logged‑in users on mobile, show a fixed bottom nav: `Inicio · Buscar · [Publicar +] · Chat · Perfil`. "Publicar" is a floating circular brand button elevated above the bar.

Create `components/common/MobileTabBar.tsx` and mount it in `app/layout.tsx` wrapped in a media query (show only on `<768px`).

### 9.3 Responsive adjustments in `_responsive.scss`

- Under 768px: Hero stacks, search bar becomes full width, no side collage.
- ProductCard: 2‑col grid with 12px gutter.
- ProductDetail: gallery stacks above info.
- Checkout right col moves below left col; keep total sticky at bottom of viewport.

Commit: `"Phase 9: mobile polish + bottom tab bar"`

---

## Done

You should now have a fully redesigned espublicar that matches `references/espublicar-hifi-v2-minimal.html`. Differences between your implementation and the reference are acceptable only if they're pixel‑level — all colors, spacing, typography, and interactions should match exactly.

### Verification checklist

- [ ] Brand color (`#2563EB`) used only for CTAs, active states, links — never for large surfaces.
- [ ] Only Inter font family loaded (no Poppins, no Helvetica, no MADE).
- [ ] No countdown timers, no "Sold: X / Available: Y" bars anywhere.
- [ ] No Compare functionality surfaced in UI (even if Redux slice remains).
- [ ] ProductCard heart icon is inside the image, top‑right.
- [ ] Header is a single row on desktop, sticky with blur when scrolled.
- [ ] Checkout shows **Bizum** as a payment method.
- [ ] Chat has inline offer cards.
- [ ] Mobile has bottom tab bar with floating Publicar button.

### What NOT to change

- Appwrite integration and auth flow (`context/AuthContext`, `lib/appwrite*`).
- Redux slices (cart, wishlist, compare) — keep them even if UI drops compare.
- Routing structure (the `(dashboard)`, `(homes)`, `(products)` route groups stay as‑is).
- `next.config.mjs` and `tsconfig.json`.

---

## If you get stuck

- Visual truth = `references/espublicar-hifi-v2-minimal.html`. Open in browser.
- Tokens must match exactly — if a color in the reference doesn't map to a token, add it to `_tokens.scss` rather than hardcoding.
- When a component in `components/` of this handoff doesn't have a spec, infer from the reference and apply the global rules (radii, shadows, chips, glass).
