# Header1 Redesign Spec

**Target file**: `components/headers/Header1.tsx`
**Also affects**: `components/headers/SearchForm.tsx`, `components/headers/Nav.tsx`, `components/headers/Topbar1.tsx` (drop)

## Goal

Collapse the current 2-row header (topbar + inner + bottom) into a **single sticky row** with blur on scroll. Remove e-commerce chrome that doesn't fit a P2P marketplace (Compare icon, currency/language selects, topbar announcements).

## Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  [Logo]   [🔍 Search bar — pill, full width]         [Publicar+] [❤] [👤] │
└───────────────────────────────────────────────────────────────────────────┘
```

- Height: **72px** desktop, **60px** mobile
- Container: `max-width: 1280px`, horizontal padding `var(--space-6)` / `var(--space-4)` on mobile
- Grid columns (desktop): `auto 1fr auto` (logo / search / actions)
- Gap between columns: `var(--space-6)`

## Sticky + blur behavior

- Position: `sticky; top: 0; z-index: 100`
- Resting state: `background: var(--surface); border-bottom: 1px solid transparent`
- Scrolled state (trigger at `scrollY > 8`): apply `.glass` utility → translucent white with 12px blur, and `border-bottom: 1px solid var(--line)`
- Keep the existing `handleScroll` logic from `app/layout.tsx` — just swap the class it toggles to `is-scrolled`, and in SCSS:

```scss
.tf-header.style-2 {
  position: sticky; top: 0; z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid transparent;
  transition: background 200ms, border-color 200ms, backdrop-filter 200ms;
  &.is-scrolled { @include glass($blur: 12px); border-bottom-color: var(--line); }
}
```

## Logo

- Keep `/images/logo/logo.svg` but recolor to `--ink`. If the SVG has hardcoded fills, either swap the file or apply `filter: brightness(0)`.
- Width **140px** desktop, **100px** mobile. Keep aspect ratio.
- `<Link href="/">` wrapper — unchanged.

## Search bar (center)

Replace the existing `<SearchForm />` contents:

```tsx
<form className="header-search" role="search">
  <input
    type="search"
    className="input-search"
    placeholder="Busca cualquier cosa… iPhone, bici, sofá"
    aria-label="Buscar"
  />
</form>
```

- Uses `.input-search` utility from `_utilities.scss` (56px tall, pill, search icon prefix)
- Max-width 560px, centered
- On mobile (`<768px`): hide — replaced by a search icon button in the right cluster that opens an overlay

No category dropdown inside the search. Advanced filters live on the /buscar page.

## Right cluster

Always visible (desktop):

1. **`Publicar` button** — primary brand CTA with a `+` icon prefix. Use `.btn-brand`. Text "Publicar" always visible on `≥md`; on `sm` collapse to icon-only `+` pill.
2. **Wishlist heart icon** — ghost button, 40×40 rounded, with count badge positioned top-right of the icon (8px circle, `--brand` bg, white 10px number).
3. **Auth slot**:
   - Logged out: "Entrar" ghost button (`.btn-ghost.btn-sm`), opens `#log` modal.
   - Logged in: 36×36 circular avatar (initials on `--brand-50` bg, `--brand` text) → on click opens a dropdown.

### Avatar dropdown (logged in)

Use Bootstrap dropdown (already available). Content:

```
┌─────────────────────────┐
│ Nombre Apellido         │
│ correo@ejemplo.com      │
├─────────────────────────┤
│ 👤 Mi perfil            │
│ 📦 Mis anuncios         │
│ 💬 Mensajes             │
│ ❤  Favoritos            │
│ ⚙  Configuración        │
├─────────────────────────┤
│ 🚪 Cerrar sesión        │
└─────────────────────────┘
```

- Panel: `.glass`, `--radius-lg`, width 240px, `--elev-3`
- Items: 40px tall, padding `0 var(--space-4)`, hover `var(--surface-3)`, 14px Inter

### Remove entirely

- The Compare icon/button
- The nav row (`header-bottom` with categories) — categories live on Home page
- Wishlist link as a separate page link (keep heart icon only)

## Mobile header (<768px)

Two rows again, but minimal:

Row 1 (48px): `[☰] Logo (centered) [+] [👤]`
Row 2 (52px): full-width search pill

Or a single row with collapsed search triggering an overlay — either works; match the reference.

## Tokens used

- `--ink`, `--ink-3`, `--ink-4`
- `--surface`, `--surface-3`, `--line`
- `--brand`, `--brand-50`
- `--radius-pill`, `--radius-lg`
- `--elev-3`, `--glass-*`
- `--space-2` through `--space-6`

## Migration notes

- Delete `<Topbar1 />` from `app/page.tsx` and anywhere it's imported.
- `NavCategories*.tsx` files can stay on disk but aren't mounted anywhere.
- Keep the `useAuth` hook wiring untouched.
- Keep the `#log` / `#register` modal `data-bs-toggle` — only the trigger button style changes.
