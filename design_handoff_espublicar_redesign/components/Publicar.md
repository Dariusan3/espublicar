# Publicar Spec (Publish Flow)

**Target**: `app/add-product/page.tsx` + `components/dashboard/AddProduct.tsx`

## Goal

Transform the generic "add product" form (with variants, SKU, inventory, shipping classes, tax) into a **consumer-grade 3-step publish flow** like Vinted/Wallapop.

## Page layout

- Single column, max-width **720px**, centered
- Padding `var(--space-9) var(--space-6)`
- Page title h1 (28px/700): "Publica tu anuncio"
- Subtitle (15px/400 `--ink-3`): "Lleva menos de un minuto. Es gratis."
- Progress dots top-right: 3 dots, active is `--brand` 8px circle, inactive is `--line-2` 8px circle

## Step 1 — Fotos

### Dropzone

```tsx
<div className="dropzone">
  <svg className="dropzone-icon">…camera…</svg>
  <p className="dropzone-title">Arrastra hasta 12 fotos</p>
  <p className="dropzone-sub">o haz clic para seleccionar</p>
  <button className="btn-ghost btn-sm">Elegir fotos</button>
</div>
```

```scss
.dropzone {
  display: grid; place-items: center;
  padding: var(--space-9);
  min-height: 280px;
  border: 2px dashed var(--line-2);
  border-radius: var(--radius-xl);
  background: var(--surface-2);
  text-align: center;
  transition: all 200ms;
  &:hover, &.is-dragover {
    border-color: var(--brand);
    background: var(--brand-50);
  }
  .dropzone-icon { width: 48px; height: 48px; color: var(--ink-3); margin-bottom: var(--space-3); }
  .dropzone-title { font: 600 18px "Inter"; color: var(--ink); }
  .dropzone-sub { font: 400 14px "Inter"; color: var(--ink-3); margin-top: var(--space-1); }
}
```

### Thumbnail row

Below dropzone, show uploaded photos in a 6-col grid (3-col mobile):

- Each thumb: square, `--radius-md`, `--elev-1`
- First thumb has a "Portada" chip overlay (`--brand` bg, white)
- On hover: dark scrim + delete X (top-right) and drag handle (top-left)
- Reorder via drag-and-drop (use `@dnd-kit/sortable` or `react-beautiful-dnd` — add as new dep if not present)

## Step 2 — Detalles

Use `.stack-5` for vertical rhythm between fields.

```
┌─────────────────────────────────┐
│ Título                          │
│ [_______________________]       │
│                                 │
│ Categoría                       │
│ [Selecciona      ▾]             │
│                                 │
│ Estado                          │
│ [Nuevo] [Como nuevo] [Bueno]    │ ← chip group
│ [Aceptable]                     │
│                                 │
│ Precio                          │
│ [€ _______] ☑ Negociable        │
│                                 │
│ Descripción                     │
│ [____________________________]  │
│ [____________________________]  │
│                                 │
│ Hasta 1000 caracteres           │ ← counter bottom-right
└─────────────────────────────────┘
```

### Fields

**Título**: `.input-field`, placeholder "Ej: iPhone 13 Pro 256GB"  
**Categoría**: custom select styled like `.input-field`, chevron icon on right  
**Estado**: chip group — clicking sets `.is-active`. Single-select.  
**Precio**: `.input-field` with `€` prefix inside. Right side has a `☑ Negociable` checkbox.  
**Descripción**: `textarea.input-field`, min-height 140px. Character counter (ink-4) under right corner.

Section title (18px/600 `--ink`): "Detalles" above the block.

## Step 3 — Envío y ubicación

```
Ubicación
[📍 Madrid, España____________] ← autocomplete
Solo mostraremos tu barrio, no tu dirección exacta.

Entrega
[🚚 Envío con espublicar]   [👋 Recogida en mano]   [✓ Ambas]
  ← chip group (multi-select where sensible)

Gastos de envío (if shipping selected)
[ ● Lo paga el comprador    ○ Lo pago yo ]
```

Section title "Envío y ubicación" same styling as Step 2.

## Sticky footer (action bar)

```
┌──────────────────────────────────────────┐
│  [Guardar borrador]         [Publicar →] │
└──────────────────────────────────────────┘
```

- Position: `sticky; bottom: 0`
- Height: 80px
- Background: `.glass` (blurred white)
- Border-top: `1px solid var(--line)`
- Container: flex, space-between
- Left: `Guardar borrador` `.btn-ghost`
- Right: `Publicar` `.btn-brand.btn-lg`, disabled until minimum fields valid (title + 1 photo + price)

## Validation

Inline below each field:
- Error: 13px `--danger` + `!` icon
- Success: 13px `--success` + `✓` icon (only show for password-like fields)

Required fields: título, categoría, estado, precio, ≥1 foto, ubicación.

## Redux / Appwrite wiring

Keep existing `AddProduct.tsx` Appwrite integration. Only the form markup and styles change. If there are fields in the current `AddProduct.tsx` that don't map to this spec (SKU, barcode, inventory, tax_class, variants), **hide them** with CSS rather than deleting — Appwrite schema may still expect them with defaults.
