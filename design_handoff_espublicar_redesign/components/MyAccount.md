# MyAccount Spec

**Target**: `app/(dashboard)/my-account/page.tsx` + `components/dashboard/MyAccount.tsx` + `components/dashboard/Sidebar.tsx` + `components/dashboard/MyAccountListings.tsx`

## Layout

Two columns, full-width minus container:

- Sidebar (left, 260px, sticky below header)
- Content (right, flex-grow)
- Gap `var(--space-7)`
- Container `max-width: 1280px`, padding `var(--space-7) var(--space-6)`

On `<992px`: sidebar becomes a horizontal scrolling chip-list at the top; content below.

## Sidebar

```scss
.account-sidebar {
  position: sticky; top: 88px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
  .user-card {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-4);
    border-bottom: 1px solid var(--line);
    margin-bottom: var(--space-2);
    .avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--brand-50); color: var(--brand); display: grid; place-items: center; font: 700 18px "Inter"; }
    .name { font: 600 15px "Inter"; color: var(--ink); }
    .email { font: 400 13px "Inter"; color: var(--ink-3); @include clamp-lines(1); }
  }
  .nav-item {
    display: flex; align-items: center; gap: var(--space-3);
    height: 44px;
    padding: 0 var(--space-4);
    border-radius: var(--radius-md);
    font: 500 14px "Inter"; color: var(--ink-2);
    transition: all 120ms;
    .icon { width: 18px; height: 18px; color: var(--ink-3); }
    &:hover { background: var(--surface-3); color: var(--ink); }
    &.is-active {
      background: var(--brand-50); color: var(--brand);
      .icon { color: var(--brand); }
    }
    .count { margin-left: auto; font: 600 12px "Inter"; background: var(--surface-3); color: var(--ink-2); padding: 2px 8px; border-radius: var(--radius-pill); }
    &.is-active .count { background: var(--brand); color: #fff; }
  }
  .nav-sep { height: 1px; background: var(--line); margin: var(--space-2) var(--space-3); }
}
```

### Nav items

1. **Resumen** (dashboard) · icon home
2. **Mis anuncios** · icon grid · count shown
3. **Mensajes** · icon chat · count (unread) shown in brand
4. **Compras** · icon bag
5. **Ventas** · icon tag
6. **Favoritos** · icon heart
7. **Valoraciones** · icon star
8. (separator)
9. **Perfil** · icon user
10. **Direcciones** · icon pin
11. **Pagos y cobros** · icon credit-card
12. **Configuración** · icon settings
13. (separator)
14. **Cerrar sesión** (ghost, at bottom, red on hover)

## Content — Resumen (dashboard)

### Header row

```
Hola, María 👋                     [+ Publicar]
Tienes 2 mensajes sin leer.
```

- Greeting h1 28px/700
- Sub 15px `--ink-3`
- Right: `.btn-brand` "+ Publicar"

### Stats tiles

4 tiles in a grid (2-col mobile, 4-col desktop):

```
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ 📦 12     │ │ 💬 2      │ │ 💰 430€   │ │ ⭐ 4.9    │
│ Anuncios  │ │ Sin leer  │ │ Ventas    │ │ Valor.    │
│ activos   │ │           │ │ este mes  │ │ (24)      │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

```scss
.stat-tile {
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  .stat-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--brand-50); color: var(--brand); display: grid; place-items: center; margin-bottom: var(--space-3); }
  .stat-value { font: 700 28px "Inter"; color: var(--ink); letter-spacing: -0.02em; }
  .stat-label { font: 500 14px "Inter"; color: var(--ink-3); margin-top: 2px; }
}
```

### Recent activity

Two-column list (desktop) / single column mobile, each column is a card with header + timeline of recent events:

**Últimos mensajes** · **Últimas visitas a tus anuncios**

Each row: avatar / title / meta / time. Max 5 items, "Ver todos" link at bottom.

## Mis anuncios

Grid of `ProductCard1` instances (3-col) with added overlay elements:

### Status pill (top-left of card image)

- `Activo` — `.chip-success`
- `Pausado` — `.chip-warn`
- `Vendido` — `.chip` with `--ink-4` text, grey
- `Revisión` — `.chip-soft` (brand)

### Menu trigger (top-right, replaces heart)

- 32×32 round glass button with `⋯`
- Click opens Bootstrap dropdown: `Editar`, `Pausar` / `Activar`, `Marcar como vendido`, `Eliminar` (danger red)

### Stats micro-row under title

`👁 124 · ❤ 8 · 💬 3` — 12px `--ink-3`

### Empty state

"Aún no has publicado nada. Empieza vendiendo lo que ya no usas." + large `.btn-brand.btn-lg` "Publicar ahora".

## Other sub-pages

- **Compras** / **Ventas**: table or card list with status pills (En camino / Entregado / Cancelado / Pendiente de pago), order ID, amount, date. Click a row to expand or go to order detail.
- **Favoritos**: reuse the same product grid with the redesigned `ProductCard1`.
- **Valoraciones**: cards with reviewer avatar, star rating (5 filled / 5), comment, date. Filter tabs "Como vendedor" / "Como comprador".
- **Perfil** (edit profile): form with avatar upload, nombre, bio (max 280 chars), ubicación por defecto.
- **Direcciones**: list of saved addresses, add-new button (opens modal).
- **Pagos y cobros**: Linked Bizum phone, card method, IBAN for withdrawals. Balance card at top showing available funds + "Retirar" CTA.
- **Configuración**: notification toggles, language, privacy, delete account.

All sub-pages use the same page-header pattern (h1 + subtitle + optional right-aligned CTA) and rely on `.stack-6` spacing between sections.
