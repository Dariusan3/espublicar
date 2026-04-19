# Home Page Spec

**Target**: `app/page.tsx` + `components/homes/home-1/*.tsx`

## Composition (top to bottom)

1. **Header** — sticky, see `Header.md`
2. **Hero** — search-first, see below
3. **Categories strip** — 10 circular tiles, horizontal scroll on mobile
4. **"Cerca de ti"** — 4-col grid of nearby listings (Products1)
5. **HowItWorks** — 3-step trust/education band
6. **"Últimas publicaciones"** — 4-col grid, different listings (Products3)
7. **SafetyStrip** (optional) — "Compra con confianza" with pago seguro / mensajería / valoraciones
8. **Footer**

Vertical rhythm: `var(--space-10)` (64px) between sections on desktop, `var(--space-8)` (40px) on mobile.

---

## Hero

**File**: `components/homes/home-1/Hero.tsx`

### Layout

- Container: `max-width: 1280px`, `padding: var(--space-9) var(--space-6)` (48px vertical)
- Grid (desktop `≥lg`): `grid-template-columns: 1.2fr 1fr; gap: var(--space-10);`
- Grid (tablet / mobile): single column, collage hidden

### Left column (copy + search)

Stack, gap `var(--space-6)`:

1. **Eyebrow** (optional): 13px `--ink-3` uppercase "Marketplace de segunda mano"
2. **Headline** (h1): `var(--fs-display)` / 700 / `--ink` / letter-spacing -0.02em / max-width 12ch  
   Copy: `Vende y compra cerca de ti.`
3. **Sub**: 18px / 400 / `--ink-2` / max-width 44ch  
   Copy: `Publica gratis en un minuto y paga seguro con Bizum o tarjeta.`
4. **Search form**: `.input-search` but 64px tall with a `Buscar` brand button embedded on the right

```tsx
<form className="hero-search">
  <input className="input-search" placeholder="¿Qué buscas? iPhone, sofá, bici…" />
  <button className="btn-brand">Buscar</button>
</form>
```

```scss
.hero-search {
  position: relative;
  .input-search { height: 64px; padding-right: 140px; font-size: 16px; }
  .btn-brand { position: absolute; right: 6px; top: 6px; height: 52px; }
}
```

5. **Suggestion chips** — horizontal row of 5 `.chip` elements with common searches:
   `iPhone · Bicicleta · Sofá · PS5 · Cochecito`

### Right column (collage)

Three product cards at small scale, rotated and overlapped:

- Card 1: top-left, `rotate(-4deg)`, 220×280, `--elev-2`
- Card 2: center, `rotate(2deg)`, z-index up, 260×320, `--elev-3`
- Card 3: bottom-right, `rotate(-2deg)`, 200×260, `--elev-2`

Use real-looking product thumbnails (Unsplash or CDN placeholders). Each card shows: image + title + price (micro version of ProductCard).

Hide on `<992px` — collage isn't necessary on narrower viewports.

### Background

- Body surface (`--surface-2`) with optional radial accent:
  ```css
  background:
    radial-gradient(60% 55% at 75% 30%, var(--brand-50), transparent 70%),
    var(--surface-2);
  ```

---

## Categories strip

**New file**: `components/homes/home-1/Categories.tsx`

### Layout

- Horizontal row of 10 tiles
- Desktop: centered, `gap: var(--space-6)`, wraps to 2 rows if needed
- Mobile: `.hscroll` utility (horizontal scroll, hidden scrollbar)

### Each tile

```tsx
<Link href={`/shop-default?cat=${cat.slug}`} className="cat-tile">
  <div className="cat-icon">{cat.emoji ?? <Icon/>}</div>
  <span className="cat-label">{cat.name}</span>
</Link>
```

```scss
.cat-tile {
  display: flex; flex-direction: column; align-items: center;
  gap: var(--space-2);
  min-width: 88px;
  .cat-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--brand-50); color: var(--brand);
    display: grid; place-items: center;
    font-size: 28px;
    transition: all 200ms var(--ease-std);
  }
  .cat-label { font: 500 13px/1.2 "Inter"; color: var(--ink); text-align: center; }
  &:hover .cat-icon { background: var(--brand); color: #fff; transform: scale(1.04); }
}
```

### Categories list

```ts
const CATS = [
  { slug: "movil",     name: "Móvil",       icon: "📱" },
  { slug: "moda",      name: "Moda",        icon: "👕" },
  { slug: "hogar",     name: "Hogar",       icon: "🛋️" },
  { slug: "motor",     name: "Motor",       icon: "🚗" },
  { slug: "tech",      name: "Tecnología",  icon: "💻" },
  { slug: "deporte",   name: "Deporte",     icon: "⚽" },
  { slug: "bebe",      name: "Bebé",        icon: "🧸" },
  { slug: "inmo",      name: "Inmo",        icon: "🏠" },
  { slug: "libros",    name: "Libros",      icon: "📚" },
  { slug: "ocio",      name: "Ocio",        icon: "🎮" },
];
```

**Note**: emojis are placeholders. Swap for monochrome SVG icons from icomoon or Lucide in production. Per the design rules in the reference, avoid emoji in final UI.

---

## HowItWorks

**New file**: `components/homes/home-1/HowItWorks.tsx`

3 columns, centered text:

```
       1                   2                   3
   Publica gratis    Chatea y negocia   Paga seguro con Bizum
   Tu anuncio en     Habla con el       Dinero retenido hasta
   menos de 60s      comprador en el    confirmar que llegó bien
                     chat integrado
```

```scss
.how-it-works {
  padding: var(--space-11) 0;
  background: var(--surface);
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-9); }
  .step {
    text-align: center;
    .num { font: 700 72px/1 "Inter"; color: var(--brand); letter-spacing: -0.04em; }
    .title { font: 600 20px/1.3 "Inter"; color: var(--ink); margin-top: var(--space-3); }
    .caption { font: 400 15px/1.55 "Inter"; color: var(--ink-3); margin-top: var(--space-2); max-width: 28ch; margin-inline: auto; }
  }
  @media (max-width: 768px) { .grid { grid-template-columns: 1fr; gap: var(--space-7); } }
}
```

---

## Products sections (grid)

Both `Products1.tsx` and `Products3.tsx` follow the same pattern:

```tsx
<section className="section-products">
  <div className="container">
    <header className="section-head">
      <h2>Cerca de ti</h2>
      <Link href="/shop-default" className="link-more">Ver más →</Link>
    </header>
    <div className="tf-grid-product">
      {products.map((p, i) => <ProductCard1 product={p} index={i} key={p.id} />)}
    </div>
  </div>
</section>
```

```scss
.section-head {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: var(--space-6);
  h2 { font: 700 var(--fs-h2) "Inter"; color: var(--ink); letter-spacing: -0.02em; }
  .link-more { font: 500 15px "Inter"; color: var(--brand); &:hover { color: var(--brand-600); } }
}
.tf-grid-product {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5) var(--space-5);
  @media (max-width: 992px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 700px) { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
}
```

**Remove** all Swiper slider / carousel markup from these sections — plain CSS grid only.

---

## Search page `/shop-default` (brief)

Reuse the same grid but wrap with a filter sidebar:

- Left (280px): `FilterSidebar.tsx` — category checkboxes, price range slider, condition chips, location radius slider, shipping toggle. Each filter in a collapsed `details` block with a small arrow.
- Top of content: active filter chips ("Madrid ×", "< 100 € ×") + sort dropdown (Más recientes / Precio ↓ / Precio ↑ / Más cercanos).
- Grid: same `.tf-grid-product` but 3-col inside the narrower content column.
- Empty state: centered illustration + "No encontramos nada. Prueba a ampliar la zona." + CTA "Crear alerta".
