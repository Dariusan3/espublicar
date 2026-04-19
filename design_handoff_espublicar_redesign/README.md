# Handoff: espublicar Redesign (V2 Minimal)

## Overview

This handoff package contains the complete visual design system and component specs for migrating the **espublicar** marketplace (a Spanish peer-to-peer classifieds app, inspired by Vinted/Wallapop/Milanuncios) to the **"V2 Minimal"** direction we validated during the design phase.

The target codebase is the Next.js 15 + React 19 + TypeScript + Bootstrap 5 + SCSS project at `github.com/Dariusan3/espublicar` (originally a Themesflat "Onsus" e‑commerce template).

The goal is **not** to rewrite the app from scratch. It's to **re‑skin the existing components** by:
1. Replacing design tokens (colors, fonts, radii, shadows) in the SCSS layer.
2. Updating a short list of high‑leverage components (Header, ProductCard, Hero, Footer, Checkout, ChatInbox, MyAccount).
3. Introducing a glassmorphism utility layer that can be opt‑in per component.

## About the Design Files

The `references/` folder contains **HTML prototypes** built in this conversation — these are design references, **not production code to copy verbatim**. Use them for:
- Exact layout proportions, spacing, and alignment
- Color values, typography scale, and component anatomy
- Interaction states (hover, active, focus) and motion
- Copy (the Spanish marketplace strings are production‑ready)

Do **not** copy the HTML structure directly into React components — instead, recreate the look using the existing component file structure (`components/headers/Header1.tsx`, `components/productCards/ProductCard1.tsx`, etc.) and the design tokens shipped in `tokens/`.

## Fidelity

**High‑fidelity.** Colors, typography, spacing, radii, and shadows are all finalized. The developer should match them pixel‑perfectly using the provided SCSS tokens.

## Target Stack Confirmed

- **Framework**: Next.js 15 (app router) + React 19 + TypeScript
- **Styling**: Bootstrap 5 + **SCSS** (not Tailwind)
- **SCSS entry**: `public/scss/main.scss` → `app.scss` → `abstracts/`, `component/`, `_sections.scss`, `_responsive.scss`
- **State**: Redux Toolkit + redux‑persist
- **Backend**: Appwrite (see `appwrite.md` in repo)
- **Icons**: icomoon custom font (`public/icons/icomoon/`)

## Design Direction: V2 Minimal

Inspired by Vinted and modern classifieds: lots of white space, crisp typography, big product imagery, pill‑shaped filter chips, soft glassmorphic surfaces for overlays, and a single bold brand color used sparingly.

**Not doing**: aggressive gradients, neon accents, heavy icon use, gamified badges, sticker‑style shadows. Avoid the stock "Onsus" e‑commerce feel entirely.

## What's In This Package

| Folder / File | Purpose |
|---|---|
| `README.md` | This file — overview, scope, migration order |
| `MIGRATION.md` | Step‑by‑step instructions for Claude Code |
| `tokens/_tokens.scss` | Drop‑in replacement for `public/scss/abstracts/_variable.scss` |
| `tokens/_mixins-extra.scss` | New mixins (glassmorphism, elevation, focus ring) |
| `tokens/_utilities.scss` | New utility classes (`.glass`, `.chip`, `.pill`, `.stack-*`) |
| `components/Header.md` | Header1 redesign spec |
| `components/ProductCard.md` | ProductCard1 redesign spec |
| `components/Home.md` | Home page composition + Hero redesign spec |
| `components/Footer.md` | Footer1 redesign spec |
| `components/Publicar.md` | add‑product / publish flow spec |
| `components/ProductDetail.md` | product‑detail page spec |
| `components/Checkout.md` | Checkout + payment method spec |
| `components/ChatInbox.md` | ChatInbox spec (buyer↔seller) |
| `components/MyAccount.md` | Dashboard / MyAccount spec |
| `components/Mobile.md` | Mobile‑specific screen overrides |
| `references/` | The hi‑fi HTML prototypes (open in browser to reference) |

## Migration Order (Recommended)

Work in this order — each phase delivers a visible upgrade even if later phases aren't done yet:

1. **Phase 1 — Tokens (30 min)**. Replace `_variable.scss`, add `_mixins-extra.scss` + `_utilities.scss`. The whole app instantly looks closer to V2 just from color + font changes.
2. **Phase 2 — Header + Footer** (1–2 h). `Header1.tsx`, `Footer1.tsx`. These appear on every page.
3. **Phase 3 — ProductCard** (1–2 h). `productCards/ProductCard1.tsx`. Reused by home, shop, wishlist, related products.
4. **Phase 4 — Home page** (2–3 h). `components/homes/home-1/Hero.tsx`, `Products1.tsx`, `Collections.tsx`. Rewire `app/page.tsx` if needed.
5. **Phase 5 — Product Detail** (2 h). `components/product-detail/Details1.tsx`, `Description.tsx`, `sliders/Slider1.tsx`.
6. **Phase 6 — Publish flow** (1 h). `components/dashboard/AddProduct.tsx`.
7. **Phase 7 — Checkout** (1 h). `components/shop-cart/Checkout.tsx`.
8. **Phase 8 — Chat + Account** (2 h). `components/dashboard/ChatInbox.tsx`, `MyAccount.tsx`, `MyAccountListings.tsx`, `Sidebar.tsx`.
9. **Phase 9 — Mobile polish** (1 h). `components/modals/MobileMenu.tsx`, responsive adjustments in `_responsive.scss`.

## Screens Covered

See individual specs in `components/` for layout, components, colors, typography, states, and copy.

| Screen | Source file(s) | Spec |
|---|---|---|
| Home | `app/page.tsx`, `components/homes/home-1/*` | `components/Home.md` |
| Search / Shop | `app/(shop)/shop-default/page.tsx`, `components/products/Products1.tsx` + `FilterSidebar.tsx` | covered inline in `Home.md` |
| Product Detail | `app/(product-detail)/product-detail/[id]/page.tsx`, `components/product-detail/Details1.tsx` | `components/ProductDetail.md` |
| Publish | `app/add-product/page.tsx`, `components/dashboard/AddProduct.tsx` | `components/Publicar.md` |
| Checkout | `app/(products)/checkout/page.tsx`, `components/shop-cart/Checkout.tsx` | `components/Checkout.md` |
| Chat | `components/dashboard/ChatInbox.tsx` | `components/ChatInbox.md` |
| Account | `app/(dashboard)/my-account/page.tsx`, `components/dashboard/MyAccount.tsx` | `components/MyAccount.md` |
| Login | `components/modals/Login.tsx`, `Register.tsx` | covered inline in `Header.md` |
| Mobile | various | `components/Mobile.md` |

## Interactions & Behavior (global)

- **Hover on cards**: elevate from `elevation-0` to `elevation-2`, image scales 1.02, 250ms ease‑out. Heart icon fades in.
- **Active chips / filters**: background fills with `--brand`, text goes white, 150ms.
- **Primary CTA hover**: darken `--brand` by ~8% (use `color-mix(in oklch, var(--brand) 92%, black)`).
- **Form focus**: 2px `--brand-alpha-30` ring, border color becomes `--brand`.
- **Modal / drawer**: backdrop `rgba(15,23,42,0.48)` with `backdrop-filter: blur(4px)`. Surface uses `.glass` utility.
- **Page transitions**: none added — let Next.js handle routing.
- **Toast**: keep `react-toastify` at `bottom-left`; override colors to match `--brand`.

## State Management

No new state required. Existing Redux slices (cart, wishlist, compare) and Appwrite Auth are unchanged. Redesign is purely presentational.

## Design Tokens

Full token list in `tokens/_tokens.scss`. Quick reference:

### Colors

| Token | Value | Usage |
|---|---|---|
| `--brand` | `#2563EB` | Primary CTAs, links, active states, logo accent |
| `--brand-600` | `#1E4FD1` | Hover state for primary |
| `--brand-50` | `#EFF5FF` | Tinted backgrounds, chip hover |
| `--ink` | `#0F172A` | Primary text, headings |
| `--ink-2` | `#334155` | Secondary text, body copy |
| `--ink-3` | `#64748B` | Tertiary text, metadata (location, date) |
| `--ink-4` | `#94A3B8` | Muted / disabled |
| `--surface` | `#FFFFFF` | Cards, modals, top surfaces |
| `--surface-2` | `#F8FAFC` | Page background |
| `--surface-3` | `#F1F5F9` | Input backgrounds, subtle fills |
| `--line` | `#E2E8F0` | Borders, dividers |
| `--line-2` | `#CBD5E1` | Stronger borders |
| `--success` | `#16A34A` | "Negociable", "Verified", success toasts |
| `--warn` | `#F59E0B` | Warnings |
| `--danger` | `#DC2626` | Errors, destructive |
| `--glass-bg` | `rgba(255,255,255,0.72)` | Glassmorphic surfaces |
| `--glass-border` | `rgba(255,255,255,0.6)` | Glass borders |

### Typography

| Role | Font | Weight | Size | Line‑height |
|---|---|---|---|---|
| Display | Inter | 700 | 48–64px | 1.05 |
| H1 | Inter | 700 | 32–40px | 1.1 |
| H2 | Inter | 600 | 24–28px | 1.2 |
| H3 | Inter | 600 | 18–20px | 1.3 |
| Body | Inter | 400 | 15–16px | 1.55 |
| Small | Inter | 500 | 13–14px | 1.4 |
| Price (lg) | Inter | 600 | 20–24px, tabular‑nums | 1.2 |
| Label | Inter | 500, 0.02em tracking | 12–13px uppercase | 1 |

**Drop Poppins, Helvetica Neue, MADE Outer, UTM Banque** — keep **Inter only** plus system fallback. Inter is already loaded in `app/layout.tsx` so no new imports needed.

### Spacing scale (4px base)

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128` px. Exposed as `--space-1` … `--space-13`.

### Radii

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Chips, small buttons |
| `--radius-md` | 12px | Inputs, dropdowns |
| `--radius-lg` | 16px | Cards, modals |
| `--radius-xl` | 20px | Hero, feature cards |
| `--radius-pill` | 999px | Pills, avatar, CTA |

### Shadows (elevation)

| Token | Value | Usage |
|---|---|---|
| `--elev-0` | none | Flat |
| `--elev-1` | `0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)` | Resting cards |
| `--elev-2` | `0 4px 12px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)` | Hover |
| `--elev-3` | `0 12px 32px rgba(15,23,42,0.08), 0 4px 12px rgba(15,23,42,0.06)` | Popovers, dropdowns |
| `--elev-4` | `0 24px 64px rgba(15,23,42,0.12), 0 8px 24px rgba(15,23,42,0.08)` | Modals |

## Assets

- **Fonts**: Inter (already loaded via Google Fonts in `app/layout.tsx`). Remove the Poppins and Helvetica Neue `<link>` tags from layout.
- **Icons**: keep existing icomoon set (`icon-cart`, `icon-heart`, `icon-map-pin`, …). Where a needed icon is missing, note it in the component spec and use an inline SVG.
- **Product imagery**: Unsplash placeholders in the HTML references; replace with real Appwrite‑hosted images in production.
- **Logo**: keep `/images/logo/logo.svg` — recolor via CSS `filter` or create an SVG variant that uses `currentColor`.

## Files (design references)

See `references/` folder. Open them in a browser to see the final look. These are **not** dependencies of the production app.

- `references/espublicar-hifi-v2-minimal.html` — all desktop screens (home, search, detail, publish, chat, checkout)
- `references/espublicar-wireframes.html` — earlier wireframes, included for context
