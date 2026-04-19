# ChatInbox Spec

**Target**: `components/dashboard/ChatInbox.tsx`

## Goal

Two-pane WhatsApp-style chat between buyer and seller, anchored on a listing, with **inline offer cards** (accept / decline / counter) inside the thread.

## Layout

- Full height: `calc(100vh - 72px)` below the header (72px = sticky header)
- Container: no max-width — spans full page on `/my-account/messages`
- Grid: `grid-template-columns: 320px 1fr`
- Background: `var(--surface-2)` overall; panes are `var(--surface)` cards with `--line` separators

## Left pane — Conversations list

```
┌─────────────────────────────┐
│ 🔍  Buscar conversación     │ ← 48px search
├─────────────────────────────┤
│ ● [av] María Gómez     12:04│
│     iPhone 13 Pro           │ ← listing subtitle
│     ¿Sigue disponible?      │
├─────────────────────────────┤
│   [av] Juan Ramírez    ayer │
│     Bici BTT                │
│     Te hago una oferta de…  │
└─────────────────────────────┘
```

### Search

`.input-search` but height 40px, tucked in the top of the pane with `var(--space-4)` padding.

### Conversation row

```scss
.conv-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  border-bottom: 1px solid var(--line);
  transition: background 120ms;
  &:hover { background: var(--surface-2); }
  &.is-active { background: var(--brand-50); border-left: 3px solid var(--brand); }
  .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
  .conv-body { min-width: 0; }
  .conv-name { font: 600 14px "Inter"; color: var(--ink); @include clamp-lines(1); }
  .conv-listing { font: 500 12px "Inter"; color: var(--ink-3); }
  .conv-preview { font: 400 13px "Inter"; color: var(--ink-3); @include clamp-lines(1); margin-top: 2px; }
  .conv-time { font: 500 12px "Inter"; color: var(--ink-4); }
  .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); }
}
```

Unread: `conv-name` becomes `var(--ink)` + weight 700, unread dot shown on left; `conv-preview` becomes `--ink-2`.

## Right pane — Thread

### Header (sticky, 72px)

```
┌────────────────────────────────────────────────────────┐
│ [av] María Gómez                            [👁] [⋯]  │
│      iPhone 13 Pro 256GB · 450 €                       │
└────────────────────────────────────────────────────────┘
```

- Avatar 40px
- Name 15px/600 `--ink`
- Listing link: 13px `--brand`, clicking opens product in new tab
- Right icons: "Ver anuncio" (eye) + overflow menu (⋯) with [Silenciar, Bloquear, Reportar]
- Bottom border `1px var(--line)`

### Messages area

- Background `var(--surface-2)`
- Padding `var(--space-5) var(--space-6)`
- Gap between bubbles `var(--space-2)`
- Gap when author changes or >5min passed `var(--space-5)`

### Message bubble

```scss
.msg {
  display: flex;
  max-width: 72%;
  &.is-me { margin-left: auto; flex-direction: row-reverse; }
  .bubble {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-lg);
    font: 400 15px/1.5 "Inter";
    word-wrap: break-word;
  }
  &.is-me .bubble {
    background: var(--brand); color: #fff;
    border-bottom-right-radius: 4px; // tail
  }
  &:not(.is-me) .bubble {
    background: var(--surface); color: var(--ink);
    border: 1px solid var(--line);
    border-bottom-left-radius: 4px;
  }
  .msg-time { font: 500 11px "Inter"; color: var(--ink-4); margin: 0 var(--space-2); align-self: flex-end; }
}
```

### Day separator

Centered pill: `Hoy` / `Ayer` / `12 noviembre`. 12px `--ink-3`, background `var(--surface-3)`, radius pill, padding `2px var(--space-3)`.

### Inline offer card

When a user sends an offer, it appears as a special card (not a bubble):

```
┌──────────────────────────────────────┐
│ 💰 Juan te hace una oferta           │
│                                      │
│               380 €                  │ ← large, tabular-nums
│        (precio listado: 450 €)       │
│                                      │
│   [Rechazar]    [Contraofertar]      │
│   [     Aceptar 380 €     ]          │
└──────────────────────────────────────┘
```

- Max-width 360px, centered in thread (`margin: 0 auto`)
- Background `var(--surface)`, border `2px solid var(--brand-100)`, `--radius-lg`, `--elev-1`
- Padding `var(--space-5)`
- When accepted: collapses to a success strip "Oferta aceptada · 380 €" green bg
- When rejected: collapses to a muted strip "Oferta rechazada"

### Composer bar

Sticky bottom, 72px, border-top `1px var(--line)`, background `var(--surface)`:

```
┌────────────────────────────────────────────────────┐
│ [+]  [__________________________]  [Hacer oferta] [↑]│
└────────────────────────────────────────────────────┘
```

- `[+]`: attach icon, opens photo picker
- Textarea: `.input-field` but transparent border, auto-grows 1→4 rows
- `Hacer oferta`: `.btn-ghost.btn-sm` — opens an inline modal to enter a custom price
- `[↑]`: send button, 40×40 circle, `--brand` bg, white arrow icon. Disabled when empty.

Enter sends, Shift+Enter newlines.

## Empty state (no conversations yet)

Centered vertical stack:
- Illustration (or just an outlined chat bubble icon, 80px)
- Title: "Aún no tienes mensajes"
- Caption: "Cuando alguien te contacte por uno de tus anuncios, lo verás aquí."

## Mobile

- Single pane — default view is the conversation list
- Tapping a conversation navigates to `/messages/[id]` showing only the thread
- Back button (chevron left) in thread header to return to list
- Composer uses `position: fixed; bottom: 0` with safe-area padding
