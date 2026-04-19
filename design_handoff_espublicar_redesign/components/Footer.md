# Footer1 Redesign Spec

**Target**: `components/footers/Footer1.tsx`

## Layout

- Background: `var(--ink)` (#0F172A near-black)
- Text default: `var(--ink-4)` (#94A3B8)
- Padding: `var(--space-11) 0 var(--space-7)` desktop / `var(--space-8) 0 var(--space-5)` mobile
- Container: `max-width: 1280px`, centered

### Grid (desktop ≥lg)

```
┌──────────────────┬──────────┬──────────┬──────────┐
│ Logo + pitch     │ Empresa  │ Ayuda    │ Comunidad│
│ App store badges │ Links…   │ Links…   │ Links…   │
└──────────────────┴──────────┴──────────┴──────────┘
┌───────────────────────────────────────────────────┐
│ © 2025 espublicar   [Visa][MC][Bizum][PayPal]     │
└───────────────────────────────────────────────────┘
```

`grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: var(--space-9);`

On `<992px`: accordion (one column open at a time). The existing `tf-collapse` accordion logic in `Footer1.tsx` already handles this — keep it, just restyle the chevron.

## Brand column

- Logo in white (invert current SVG): `filter: brightness(0) invert(1)`
- Pitch (14px `--ink-4`, 28ch max): `El marketplace para vender y comprar de segunda mano cerca de ti, con pago seguro.`
- App store badges: 2 monochrome SVG buttons (App Store, Google Play), 120×40 each, outlined with `var(--ink-3)`. Placeholder — replace with real badges when available.

## Link columns

**Empresa**: Sobre nosotros · Cómo funciona · Trabaja con nosotros · Prensa · Blog  
**Ayuda**: Centro de ayuda · Contacto · Confianza y seguridad · Envíos y pagos · Reembolsos  
**Comunidad**: Comunidad espublicar · Programa Pro · Invita a un amigo · Eventos

Column header: 12px Inter 600 uppercase `--ink-5` tracking 0.04em, margin-bottom `var(--space-4)`.

Link: 14px Inter 400 `--ink-4`, height 36px (click area), hover `--surface` / underline.

## Bottom bar

- Top border: `1px solid rgba(255,255,255,0.08)`
- Padding-top: `var(--space-5)`
- Flex row, space-between
- Left: `© 2025 espublicar · Todos los derechos reservados` + `Privacidad · Términos · Cookies` (separated by `·`, all `--ink-4` 13px)
- Right: payment method icons, monochrome white, 28px tall, gap `var(--space-4)`: Visa, Mastercard, **Bizum**, PayPal

On mobile: stacked, `gap: var(--space-4)`.

## Remove

- Any newsletter input inside the footer (already a separate modal via `NewsLetter.tsx`)
- "Store locator" / physical address block — espublicar is digital-only
- Social icons block if present — move to the top bar or drop

## Tokens

- `--ink`, `--ink-3`, `--ink-4`, `--ink-5`
- `--surface` (white, for hover states)
- `--space-4`, `--space-5`, `--space-7`, `--space-9`, `--space-11`
