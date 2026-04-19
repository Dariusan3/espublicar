# Mobile Spec

**Target**: responsive overrides in `public/scss/_responsive.scss` + `components/modals/MobileMenu.tsx` + new `components/common/MobileTabBar.tsx`

## Breakpoints

- `≥1280px`: full desktop
- `992–1279px`: desktop minor (collage hidden, 3-col grids)
- `768–991px`: tablet (2-col dashboard, inline sidebar)
- `<768px`: mobile

## Mobile header

Already covered in `Header.md` — restated briefly:

- Row 1 (48px): `[☰] Logo [+] [👤]` — hamburger opens MobileMenu drawer, `+` opens `/add-product`, avatar opens auth or account
- Row 2 (52px): full-width search pill

Sticky with `.glass` on scroll.

## MobileMenu drawer

**Target**: `components/modals/MobileMenu.tsx`

- Offcanvas from **right**, width 88% of viewport, max 360px
- Background `.glass-lg`
- Padding `var(--space-5)`
- Sections (stacked, gap `var(--space-6)`):
  1. **User block**: large avatar (64px) + name + email, with `Ver mi perfil` link. Logged-out state: "Inicia sesión" brand CTA + "Crear cuenta" ghost CTA
  2. **Search pill** (44px, `.input-search`)
  3. **Primary nav** (grid of icon tiles, 2 columns):
     - Inicio · Buscar · Publicar · Mensajes · Favoritos · Mis anuncios
     - Each tile: 80px tall card, icon top + label below (13px `--ink`)
  4. **Categories list** (vertical): 44px rows with icon + name + chevron
  5. **Footer links**: Ayuda · Términos · Privacidad (13px `--ink-3`)

Close button: 40×40 circle top-right with × icon.

Drop any e-commerce chrome from the current `MobileMenu.tsx` (currency/language pickers, "shop by brand", etc.).

## Bottom tab bar

**New file**: `components/common/MobileTabBar.tsx`

Visible only on `<768px`, only for logged-in users (hide on landing for logged-out to avoid blocking CTAs).

```tsx
export default function MobileTabBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;
  return (
    <nav className="mobile-tabbar">
      <Link href="/" className={cn("tab", pathname === "/" && "is-active")}>
        <HomeIcon /><span>Inicio</span>
      </Link>
      <Link href="/shop-default" className={cn("tab", pathname.startsWith("/shop") && "is-active")}>
        <SearchIcon /><span>Buscar</span>
      </Link>
      <Link href="/add-product" className="tab tab-fab">
        <PlusIcon size={28} />
      </Link>
      <Link href="/my-account-messages" className={cn("tab", pathname.includes("messages") && "is-active")}>
        <MessageIcon /><span>Chat</span>
      </Link>
      <Link href="/my-account" className={cn("tab", pathname.startsWith("/my-account") && "is-active")}>
        <UserIcon /><span>Perfil</span>
      </Link>
    </nav>
  );
}
```

Mount in `app/layout.tsx`:

```tsx
{children}
<MobileTabBar />
```

### Styles

```scss
.mobile-tabbar {
  display: none;
  @media (max-width: 767px) {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: calc(64px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    @include glass($blur: 16px);
    border-top: 1px solid var(--line);
    z-index: 90;
    align-items: stretch;
    justify-content: space-around;
  }
  .tab {
    flex: 1;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 2px;
    color: var(--ink-3);
    font: 500 11px "Inter";
    svg { width: 22px; height: 22px; }
    &.is-active { color: var(--brand); }
  }
  .tab-fab {
    position: relative; top: -16px;
    flex: 0 0 auto;
    width: 56px; height: 56px;
    border-radius: 50%;
    background: var(--brand);
    color: #fff;
    box-shadow: var(--elev-3);
    svg { width: 28px; height: 28px; }
    &:active { transform: scale(0.95); }
  }
}
```

Also add `padding-bottom: calc(64px + env(safe-area-inset-bottom))` to page content wrapper on mobile so the tab bar doesn't occlude content.

## Responsive adjustments

### `_responsive.scss` additions

```scss
@media (max-width: 991px) {
  .hero-collage { display: none; }
  .tf-grid-product { grid-template-columns: repeat(3, 1fr); }
  .account-sidebar { position: static; margin-bottom: var(--space-5); }
}

@media (max-width: 767px) {
  // Hero
  .hero { padding: var(--space-7) var(--space-4); }
  .hero-search .btn-brand { display: none; } // search button collapses on mobile
  .hero-chips { @include hide-scrollbar; display: flex; overflow-x: auto; flex-wrap: nowrap; }

  // Product grid
  .tf-grid-product { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
  .card-title { font-size: 14px; }
  .card-price  { font-size: 18px; }

  // Product detail
  .pd-main { grid-template-columns: 1fr; }
  .pd-cta-sticky {
    position: fixed; bottom: 0; left: 0; right: 0;
    @include glass;
    padding: var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom));
    display: flex; gap: var(--space-3); z-index: 80;
  }

  // Checkout
  .checkout-grid { grid-template-columns: 1fr; }
  .checkout-summary { position: static; }
  .checkout-paybar {
    position: fixed; bottom: 0; left: 0; right: 0;
    @include glass;
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom));
    z-index: 80;
    .total { font: 700 18px "Inter"; color: var(--ink); }
    .btn-brand { flex: 1; }
  }

  // Chat
  .chat-shell { grid-template-columns: 1fr; }
  .chat-list { display: none; }
  .chat-list.is-mobile-visible { display: block; }

  // Forms
  h1 { font-size: 24px; }
  .input-field, .input-search { height: 48px; font-size: 16px; } // 16px to prevent iOS zoom
}
```

## Touch targets

All interactive elements must be **≥44×44px** on touch devices. Heart icons, chips, and icon buttons already meet this. Audit the `card-meta` icons and dropdown items — they're text-only so the link hit area matters more than icon size.

## Gestures

- Product gallery on mobile: swipe left/right (keep existing Swiper if used in Slider1).
- Chat list: swipe-left on a conversation reveals "Silenciar" / "Eliminar" actions (optional, nice-to-have, don't block migration).
- Pull-to-refresh on listing grids: rely on native browser behavior; don't implement custom.
