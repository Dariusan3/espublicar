# Checkout Spec

**Target**: `app/(products)/checkout/page.tsx` + `components/shop-cart/Checkout.tsx`

## Goal

Simplify from "multi-line-item e-commerce cart checkout" to **"Reservar este artículo" — single item, single payment, with Bizum as a first-class option**.

## Page layout

- Container: `max-width: 1120px`, padding `var(--space-7) var(--space-6)`
- Heading h1: "Completa tu compra" (28px/700)
- Grid: `grid-template-columns: 1.4fr 1fr; gap: var(--space-7)`
- Mobile: single column, right column moves below left, keep total sticky at bottom

## Left column — Forms

Vertical stack of cards, gap `var(--space-5)`.

### Card 1 — Artículo

```
┌────────────────────────────────────────────────┐
│ [thumb 88×88]  iPhone 13 Pro 256GB             │
│                Vendedor: María Gómez           │
│                                           450 €│
└────────────────────────────────────────────────┘
```

- Background `var(--surface)`, `--radius-lg`, border `1px var(--line)`
- Padding `var(--space-4)`

### Card 2 — Entrega

Section title "¿Cómo quieres recibirlo?" (18px/600).

Radio group with rich options (not native radio):

```
┌────────────────────────────────────────────────┐
│ ● [🚚] Envío con espublicar         4,50 €     │
│       Llega en 2–3 días con seguimiento        │
├────────────────────────────────────────────────┤
│ ○ [👋] Recogida en mano             Gratis     │
│       Acuerda el punto de encuentro por chat   │
└────────────────────────────────────────────────┘
```

```scss
.delivery-option {
  display: grid; grid-template-columns: auto 1fr auto; gap: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  cursor: pointer;
  & + & { margin-top: var(--space-3); }
  &:hover { border-color: var(--line-2); background: var(--surface-2); }
  &.is-selected { border-color: var(--brand); background: var(--brand-50); box-shadow: 0 0 0 3px var(--brand-alpha-12); }
  .delivery-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--surface-3); display: grid; place-items: center; }
  .delivery-title { font: 600 15px "Inter"; color: var(--ink); }
  .delivery-sub   { font: 400 13px "Inter"; color: var(--ink-3); margin-top: 2px; }
  .delivery-cost  { font: 600 15px "Inter"; color: var(--ink); }
}
```

### Card 3 — Dirección de envío (shown only if Envío selected)

Standard address form:

```
Nombre completo       Teléfono
[_____________]       [_____________]

Dirección
[____________________________________]

Piso / escalera / puerta (opcional)
[____________________________________]

Código postal    Ciudad           Provincia
[________]       [__________]     [Madrid ▾]
```

All fields use `.input-field`. Grid gap `var(--space-4)`.

### Card 4 — Método de pago

Section title "¿Cómo pagas?" (18px/600).

Radio group like delivery, 3 options:

```
● [Visa][MC] Tarjeta de crédito o débito
  ──────────────────────────────────────
  Número           Fecha    CVC
  [____________]   [__]     [___]

○ [Bizum] Bizum
  Usaremos tu número registrado en Bizum.

○ [PayPal] PayPal
```

- Selected option expands inline to show its sub-fields (card fields, etc.)
- Payment method logos: official SVGs (no emoji). Each 40px tall on the radio row.
- Bizum icon: official green-teal `#00A0C3` glyph. Since Bizum is specifically important for Spain, keep it prominent.

## Right column — Summary (sticky)

```
┌────────────────────────────────┐
│ Resumen                        │
│                                │
│ Artículo              450,00 € │
│ Comisión de servicio   13,50 € │
│ Envío                   4,50 € │
│ ──────────────────────────────│
│ Total a pagar         468,00 € │
│                                │
│ [  Pagar 468,00 € →  ]         │
│                                │
│ 🛡 Pago retenido hasta que     │
│    confirmes recibir el art.   │
│ ↩ Reembolso íntegro si no      │
│    llega o no es como describe │
└────────────────────────────────┘
```

- Position: `sticky; top: 88px` (below header)
- Background: `var(--surface)`, border `1px var(--line)`, `--radius-lg`, `--elev-1`
- Padding: `var(--space-5)`
- Heading "Resumen": 16px/600 `--ink`, margin-bottom `var(--space-4)`
- Line items: flex row space-between, 14px, gap `var(--space-2)`. Label left (`--ink-2`), amount right (`--ink` tabular-nums)
- Separator: 1px `--line`, margin `var(--space-3) 0`
- Total: 18px/700 `--ink`, tabular-nums
- CTA: `.btn-brand.btn-lg.btn-block`, margin-top `var(--space-5)`. Button label includes live total.
- Trust bullets below: 13px `--ink-3`, each with small icon

## Footer legal line

Below the 2-column grid, centered 13px `--ink-4`:

`Al pulsar "Pagar" aceptas los Términos y la Política de privacidad. Pagos procesados por Stripe.`

## Remove entirely

- Coupon / promo code field — not relevant for P2P
- Multiple payment gateways list beyond Tarjeta / Bizum / PayPal
- "Create account during checkout" — users must already be logged in to reserve
- Shipping method list with rates table — simplified to the 2 options above
- Order notes textarea

## Mobile

- Stack: Artículo → Entrega → Dirección → Pago → Summary (not sticky — becomes inline at bottom)
- Show a **fixed bottom "Pagar" bar** (48px + safe-area-inset-bottom) with the total + CTA — mirrors the summary's pay button, always accessible.
